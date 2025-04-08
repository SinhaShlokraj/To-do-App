const cacheName = 'todo-app-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './serviceWorker.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
