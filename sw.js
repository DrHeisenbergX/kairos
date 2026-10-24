/* Kairos Service Worker – App-Shell offline, Marktdaten network-first */
const VERSION = 'kairos-v1.0.0';
const SHELL = 'kairos-shell-' + VERSION;
const DATA = 'kairos-data';
const SHELL_FILES = [
  './', './index.html', './manifest.webmanifest', './favicon.png',
  './apple-touch-icon.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await shell.addAll(SHELL_FILES.map((u) => new Request(u, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('kairos-shell-') && k !== SHELL).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
async function markCached(res) {
  const h = new Headers(res.headers); h.set('x-kairos-cache', '1');
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: h });
}
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  /* Marktdaten: immer zuerst Netz, sonst letzte gespeicherte Version */
  if (url.pathname.includes('/data/')) {
    event.respondWith((async () => {
      const cache = await caches.open(DATA);
      const key = url.origin + url.pathname;
      try {
        const res = await fetch(req, { cache: 'no-store' });
        if (res && res.ok) { cache.put(key, res.clone()); return res; }
        throw new Error('HTTP ' + (res && res.status));
      } catch (e) {
        const hit = await cache.match(key);
        if (hit) return markCached(hit);
        return new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      }
    })());
    return;
  }
  /* App-Shell: stale-while-revalidate */
  event.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const key = req.mode === 'navigate' ? './index.html' : req;
    const hit = await cache.match(key, { ignoreSearch: true });
    const net = fetch(req).then((res) => { if (res && res.ok && res.type === 'basic') cache.put(key, res.clone()); return res; }).catch(() => null);
    if (hit) { event.waitUntil(net); return hit; }
    const res = await net;
    return res || new Response('Offline – Inhalt nicht verfügbar', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
