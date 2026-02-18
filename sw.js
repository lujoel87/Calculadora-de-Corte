const CACHE_NAME = 'eco-kraft-corte-v2';

// Lista exhaustiva de recursos para que los módulos ES6 funcionen offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/metadata.json',
  '/manifest.json',
  '/lib/calculator.ts',
  '/components/InputForm.tsx',
  '/components/ResultsView.tsx',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap'
];

// Instalación: Cachear todos los recursos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto, guardando recursos...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Forzar que el SW se convierta en el activo inmediatamente
  self.skipWaiting();
});

// Activación: Limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Intercepción de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devolvemos (Cache First)
      if (response) {
        return response;
      }

      // Si no está, intentamos ir a la red
      return fetch(event.request).then((networkResponse) => {
        // No cacheamos respuestas que no sean exitosas o sean de otros dominios (opcional)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clonamos la respuesta para guardarla en caché y devolverla
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Si falla la red y no hay caché, podrías devolver una página offline aquí
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});