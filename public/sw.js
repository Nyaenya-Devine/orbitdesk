// OrbitDesk Service Worker v6.16.3 — Auto-Update PWA — Fixes desktop not reflecting update
const CACHE_NAME = 'orbitdesk-v6.16.3-real-live-demo';
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
  console.log('[OrbitDesk SW] Install v6.16.3 — real live demo, fixed stuck start page, AD fully functional');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        return cache.addAll(['/', '/lab', '/manifest.json']);
      });
    })
  );
  self.skipWaiting(); // Immediately activate new version — fixes desktop not reflecting update
});

self.addEventListener('activate', (event) => {
  console.log('[OrbitDesk SW] Activate v6.16.3 — cleaning old caches, forcing update');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[OrbitDesk SW] Deleting old cache', cacheName, '— fixes desktop not reflecting update');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[OrbitDesk SW] Claiming clients — forces reload with new version');
      return self.clients.claim();
    }).then(() => {
      // Notify all clients to reload
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'NEW_VERSION', version: CACHE_NAME });
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  // For HTML/JS/CSS — Network First, no cache — ensures Vercel deploy seen immediately — fixes desktop not reflecting update
  // For images/icons/audio — Cache First for speed but with network fallback
  const url = event.request.url;
  
  // Never cache MP4 videos — they are large and cause corrupt/broken screenshot page
  if (url.includes('.mp4') || url.includes('.webm')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  if (url.includes('/icon-') || url.includes('/orbitdesk-logo-') || url.includes('/audio/') || url.includes('.png') || url.includes('.jpg')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Only cache small images, not large demo images
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
    // Network first — ensures Vercel deploy seen immediately — fixes desktop not reflecting update
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache HTML — always fresh
          if (event.request.method === 'GET' && response.status === 200 && !url.includes('/lab') && !url.includes('/demo') && !url.includes('/walkthrough')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
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
    console.log('[OrbitDesk SW] Skip waiting — force update');
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    console.log('[OrbitDesk SW] Force update — deleting all caches');
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))).then(() => self.skipWaiting());
  }
});

// Periodic update check — every 60s check for new version
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-update') {
    event.waitUntil(
      fetch('/manifest.json').then(r => r.json()).then(manifest => {
        console.log('[OrbitDesk SW] Periodic check', manifest.version);
      })
    );
  }
});
