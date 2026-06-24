const CACHE_NAME = 'pokedex-trainer-v2';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './components/menu.js',
  './components/quiz.js',
  './data/pokemon.js',
  './services/gameState.js',
  './services/pokemonService.js',
  './manifest.json'
];

for (let i = 1; i <= 1025; i++) {
  urlsToCache.push(`./sprites/${String(i).padStart(4, '0')}.png`);
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, guardando recursos...');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Error cacheando recursos:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            console.log('Offline - recurso no disponible:', event.request.url);
            return new Response('Recurso no disponible offline');
          });
      })
  );
});