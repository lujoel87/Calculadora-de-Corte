const CACHE_NAME = 'eco-kraft-v4';

// Recursos críticos iniciales
const PRECACHE_ASSETS = [
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
  'https://cdn.tailwindcss.com?plugins=forms,container-queries'
];

// Instalación: Guardar recursos básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de versiones viejas
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

// Intercepción de peticiones: Estrategia Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Si la petición es válida, la guardamos/actualizamos en caché
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Si falla la red (offline) y es una navegación, devolver index.html
          if (event.request.mode === 'navigate') {
            return cache.match('/index.html') || cache.match('/');
          }
          return null;
        });

        // Devolvemos la respuesta cacheada si existe, o esperamos a la red
        return cachedResponse || fetchPromise;
      });
    })
  );
});