// Debt Tracker · Service Worker (network-first)
// ดึงเวอร์ชันใหม่จากเน็ตเสมอเมื่อออนไลน์ + fallback cache เมื่อออฟไลน์
const CACHE = 'debt-tracker-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;                 // ไม่แตะ POST (อัปสลิป)
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;        // เฉพาะไฟล์ของแอปเอง
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
