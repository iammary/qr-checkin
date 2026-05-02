/* __PRECACHE_MANIFEST_START__ */
const CACHE_VERSION = 'facility-checkin-dev-v2';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/qr/facilities/manifest.json',
];
/* __PRECACHE_MANIFEST_END__ */

const PRECACHE_URL_SET = new Set(PRECACHE_URLS);
const STATIC_ASSET_PATTERN = /\/(?:_next\/static|icons\/|qr\/)/;

const cacheResponse = async (request, response) => {
  if (!response || response.status >= 400) {
    return;
  }

  const cache = await caches.open(CACHE_VERSION);
  await cache.put(request, response.clone());
};

const offlineFallback = () =>
  new Response('Offline content is unavailable until the app has completed one successful production load.', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    status: 503,
  });

const cacheFirst = async request => {
  const cached = await caches.match(request, { ignoreSearch: true });

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  await cacheResponse(request, response);

  return response;
};

const navigationFallback = async request => {
  try {
    const response = await fetch(request);
    await cacheResponse('/', response);

    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true })) ?? (await caches.match('/')) ?? (await caches.match('/index.html')) ?? offlineFallback();
  }
};

const networkFirst = async request => {
  try {
    const response = await fetch(request);
    await cacheResponse(request, response);

    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true })) ?? offlineFallback();
  }
};

const isStaticAsset = pathname => PRECACHE_URL_SET.has(pathname) || STATIC_ASSET_PATTERN.test(pathname);

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames.filter(cacheName => cacheName !== CACHE_VERSION).map(cacheName => caches.delete(cacheName))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(navigationFallback(request));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
