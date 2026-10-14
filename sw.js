/**
 * Service Worker para Epifanía Belleza PWA
 * Habilita instalación en pantalla de inicio / escritorio
 */

const CACHE_NAME = 'epifania-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './css/chatbot.css',
  './js/data.js',
  './js/app.js',
  './js/chatbot.js',
  './assets/img/logo.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback si no hay conexión
        return caches.match('./index.html');
      });
    })
  );
});
