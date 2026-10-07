const CACHE = 'egradjanin-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  const isAsset = request.url.includes('/_astro/');
  if (isAsset) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res))),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => put(request, res))
      .catch(() => caches.match(request)),
  );
});

function put(request, response) {
  if (response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((c) => c.put(request, copy));
  }
  return response;
}
