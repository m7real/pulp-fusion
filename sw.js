/* PULP FUSION — service worker
   Cache-first shell: the whole arcade is 2 HTML files + art, so it runs fully offline. */
const CACHE = 'pulp-fusion-v2';
const ASSETS = [
  './',
  './index.html',
  './pulp-fusion.html',
  './manifest.webmanifest',
  './install.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // navigations: cache-first, fall back to the home page offline
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).catch(() => caches.match('./index.html')))
    );
    return;
  }

  // everything else: try cache, then network, then stash what came back
  e.respondWith(
    caches.match(req).then(hit =>
      hit ||
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => undefined)
    )
  );
});
