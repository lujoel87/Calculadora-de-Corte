const CACHE_NAME = 'eco-kraft-v12-final';

// Recursos locales mínimos para que la cáscara de la app funcione
const PRECACHE_OFFLINE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/lib/calculator.ts',
  '/components/InputForm.tsx',
  '/components/ResultsView.tsx',
  '/manifest.json',
  '/metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Instalando Pre-caché...');
      return cache.addAll(PRECACHE_OFFLINE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Solo procesar peticiones GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Si está en caché, lo devolvemos inmediatamente (Cache-First)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Si no está, lo buscamos en la red
      return fetch(event.request).then((networkResponse) => {
        // Solo cacheamos respuestas válidas
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Guardamos dinámicamente (esto captura React, Tailwind y fuentes al primer uso)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 3. OFFLINE CRÍTICO: Si falla la red y es una navegación, devolver el index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        return null;
      });
    })
  );
});