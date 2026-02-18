const CACHE_NAME = 'corte-offline-v1';

// Lista exhaustiva de recursos para que la app funcione sin internet
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './lib/calculator.ts',
  './components/InputForm.tsx',
  './components/ResultsView.tsx',
  './manifest.json',
  './icono.png',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap'
];

// Instalación: Guardar todo en caché inmediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando recursos para modo offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Intercepción de peticiones: Estrategia Cache First (Priorizar caché para offline)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devolvemos (rápido y offline)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está, lo buscamos en la red
      return fetch(event.request).then((networkResponse) => {
        // Guardamos dinámicamente nuevas peticiones válidas
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si falla la red y no hay caché, fallback al index principal para SPAs
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});