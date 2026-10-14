/**
 * Service Worker para Epifanía Belleza PWA (v3)
 * Estrategia Network-First para scripts y datos dinámicos, Cache-First para estáticos.
 */

const CACHE_NAME = 'epifania-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './css/style.css',
  './css/admin.css',
  './css/chatbot.css',
  './js/data.js?v=141026',
  './js/admin.js?v=141026',
  './js/app.js?v=141026',
  './js/chatbot.js?v=141026',
  './assets/img/logo.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Advertencia precaching SW:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-First para archivos HTML, JS, JSON y rutas de navegación
  const isDynamicAsset = (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/admin')
  );

  if (isDynamicAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || (url.pathname.includes('admin') ? caches.match('./admin.html') : caches.match('./index.html'));
          });
        })
    );
    return;
  }

  // Cache-First para imágenes y fuentes estáticas
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
