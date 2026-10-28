const CACHE = 'rolldex-v9';
const SHELL = ['./', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

// Hosts like Cloudflare Pages redirect /index.html to /. Browsers (Safari especially)
// refuse to open a page when a service worker answers a navigation with a redirected
// response, which leaves an installed app that will not launch. Always store and serve
// a clean copy instead.
function clean(res){
  if(!res || !res.redirected) return res;
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (event) => {
  // Activate right away so a build that cannot launch is replaced on the next open.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(SHELL.map((u) =>
        fetch(new Request(u, { cache: 'reload' }))
          .then((res) => (res && res.ok ? cache.put(u, clean(res)) : null))
          .catch(() => null)
      ))
    )
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Same-origin: cached copy first, refreshed in the background. Page loads always map to './'.
// Cross-origin (YouTube, thumbnails) is left alone.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  const key = req.mode === 'navigate' ? './' : req;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(req.mode === 'navigate' ? './' : req).then((res) => {
      if(res && res.ok){ cache.put(key, clean(res.clone())).catch(() => {}); }
      return clean(res);
    });
    if(cached) { network.catch(() => {}); return cached; }
    try { return await network; }
    catch(e){ return (await cache.match('./')) || Response.error(); }
  })());
});
