// Root-scope SW kill-switch for legacy registrations at /sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        try {
            if (self.caches && caches.keys) {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            }
            if (self.registration && self.registration.unregister) {
                await self.registration.unregister();
            }
            const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            for (const client of clientsList) {
                try { client.navigate(client.url); } catch (_) { }
            }
        } catch (_) { }
    })());
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request, { cache: 'reload' }));
        return;
    }
    event.respondWith(fetch(event.request));
});


