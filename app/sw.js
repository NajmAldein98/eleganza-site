// تطبيق إليغانزا: يحفظ واجهة التطبيق عشان يفتح بسرعة، والبيانات دائماً من الخادم
const V = "elg-app-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "../img/logo-crown.png", "../media/saleh-face.webp"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.pathname.includes("/api/")) return;
  if (u.origin === location.origin && /\.(jpg|webp|png)$/.test(u.pathname)) {
    e.respondWith(caches.open(V).then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { if (res.ok && res.status === 200) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then((res) => { if (res.ok) caches.open(V).then((c) => c.put(e.request, res.clone())); return res; }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html"))));
  }
});
