// OrbitDesk service worker — local-first application shell
const CACHE_NAME = 'orbitdesk-v7.1';
const urlsToCache = [
  '/',
  '/lab',
  '/demo',
  '/walkthrough',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        return cache.addAll(['/', '/lab', '/manifest.json']);
      });
    })
  );
  self.skipWaiting(); // Immediately activate — fixes desktop not reflecting update
});

self.addEventListener('activate', (event) => {

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[OrbitDesk SW] Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {

      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'NEW_VERSION', version: CACHE_NAME });
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never cache MP4 — lean repo, no corrupt screenshot page
  if (url.includes('.mp4') || url.includes('.webm')) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (url.includes('/icon-') || url.includes('/orbitdesk-logo-') || url.includes('/audio/') || url.includes('.png') || url.includes('.jpg')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          if (fetchResponse.ok && !url.includes('demo-') && !url.includes('walkthrough-')) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          }
          return fetchResponse;
        });
      }).catch(() => fetch(event.request))
    );
  } else {
    // Network first — ensures Vercel deploy seen immediately — no-cache headers + version bump
    event.respondWith(
      fetch(event.request, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } })
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || caches.match('/lab'));
        })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {

    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  if (event.data && event.data.type === 'FORCE_UPDATE') {

    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))).then(() => self.skipWaiting());
  }
});
