const CACHE_NAME = 'eco-kraft-v5-final';

// Lista exhaustiva de todo lo necesario para arrancar la app desde cero
const ASSETS_TO_PRECACHE = [
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
  // Librerías externas críticas (Importmap)
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://esm.sh/react@^19.2.4/',
  // Estética y Fuentes
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap'
];

// Instalación: Forzar la descarga de todo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos addAll pero permitimos que algunos fallen si son externos (opcional)
      return cache.addAll(ASSETS_TO_PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar cualquier rastro de versiones viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Estrategia "Cache First" para archivos estáticos y "Network First" para el resto
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devolvemos inmediatamente (Velocidad máxima)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está en caché, lo buscamos en la red y lo guardamos para la próxima
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // FALLBACK: Si falla la red y no hay caché...
        // Si es una navegación (abrir la app), devolvemos el index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
      });
    })
  );
});