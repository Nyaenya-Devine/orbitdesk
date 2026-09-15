// OrbitDesk Service Worker v6.4 — Auto-Update PWA
const CACHE_NAME = 'orbitdesk-v6.4-progression';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/orbitdesk-logo-godmode-polished.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('[OrbitDesk SW] Install v6.4');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        return cache.addAll(['/', '/manifest.json']);
      });
    })
  );
  self.skipWaiting(); // Immediately activate new version
});

self.addEventListener('activate', (event) => {
  console.log('[OrbitDesk SW] Activate v6.4 — cleaning old caches');
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // For HTML/JS/CSS — Network First, so user always gets latest on push
  // For images/icons — Cache First for speed
  if (event.request.url.includes('/icon-') || event.request.url.includes('/orbitdesk-logo-') || event.request.url.includes('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Network first — ensures Vercel deploy is seen immediately
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Optionally cache successful GETs
          if (event.request.method === 'GET' && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
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
});
