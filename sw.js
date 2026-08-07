const CACHE_NAME = 'riven-clicker-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', (e) => {
  console.log('[Riven SW] Instalando...');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Riven SW] Activado ✅');
  e.waitUntil(
    caches.keys().then(nombres => {
      return Promise.all(
        nombres.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(respuesta => {
        return respuesta || fetch(e.request)
          .then(respuestaRed => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(e.request, respuestaRed.clone());
              return respuestaRed;
            });
          });
      })
  );
});

