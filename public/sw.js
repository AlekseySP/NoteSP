// Service Worker для офлайн-работы приложения «Дневник»
const CACHE_NAME = 'diary-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
];

// Установка — кешируем основные файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация — удаляем старые кеши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Обработка запросов — стратегия "Stale-While-Revalidate"
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // Запрашиваем свежую версию из сети
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Кешируем успешные ответы
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Если сеть недоступна и нет кеша — возвращаем offline-страницу
          return cachedResponse || caches.match('/index.html');
        });

      // Возвращаем кеш сразу (если есть), не дожидаясь сети
      return cachedResponse || fetchPromise;
    })
  );
});
