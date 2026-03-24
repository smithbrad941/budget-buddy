
/* sw.js (minimal known-good) */
const CACHE = 'budget-buddy-v1';
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  // You can add more later: './manifest.webmanifest', icons, etc.
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // For navigations: try network first, fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For other requests: serve from cache or fall back to network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
