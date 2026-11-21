// রোবট পাঠশালা অফলাইন সার্ভিস ওয়ার্কার।
// সাইটের কোনো ফাইল বদলালে VERSION বাড়াও, তাহলে সবার কাছে নতুন সংস্করণ পৌঁছাবে।
const VERSION = 'v8';
const CACHE = 'robot-pathshala-' + VERSION;
const FONTS = 'robot-pathshala-fonts';
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'app.js', 'app2.js', 'comps.js', 'build.js', 'missions.js', 'mazecore.js', 'maze.js', 'story.js', 'daily.js', 'cert.js', 'voice.js', 'pwa.js', 'i18n.js', 'en-content.js', 'en-missions.js', 're1.js', 're2.js', 're3.js', 're4.js', 'links.js',
  'r1.js', 'r2.js', 'r3.js', 'r4.js', 'x1.js', 'x2.js', 'x3.js', 'x4.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-64.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('robot-pathshala-') && k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => { if (e.data === 'update') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Google Fonts: keep a copy so Bengali text looks right offline
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // the site's own files: from the saved copy first, so it opens instantly and works offline
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  }).catch(() => req.mode === 'navigate' ? caches.match('index.html') : undefined)));
});
