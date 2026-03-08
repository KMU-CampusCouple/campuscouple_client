// 배포 시 버전 올려서 이전 캐시 무효화 (예: v2, v3)
const CACHE_NAME = 'campus-couple-v2';

const STATIC_PRECACHE = ['/manifest.json', '/logo.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isDocumentOrScriptStyle(request, url) {
  const dest = request.destination;
  if (dest === 'document' || dest === 'script' || dest === 'style') return true;
  if (url.pathname.startsWith('/_next/')) return true;
  if (url.pathname === '/' || url.pathname === '') return true;
  return false;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.method !== 'GET') return;

  // 문서·JS·CSS: 네트워크 우선 → 실패 시에만 캐시 (업데이트 반영)
  if (isDocumentOrScriptStyle(request, url)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          if (res.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 이미지·폰트 등: 캐시 우선 → 없으면 네트워크 후 캐시 (오프라인 대비)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        const clone = res.clone();
        if (res.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      });
    })
  );
});
