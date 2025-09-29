// SW Kill-switch: clears caches and unregisters itself, then forces client reloads
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Delete all caches
      if (self.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      // Unregister this SW
      if (self.registration && self.registration.unregister) {
        await self.registration.unregister();
      }

      // Force refresh of all clients
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        try {
          // Try to reload via navigate
          client.navigate(client.url);
        } catch (_) {
          // ignore
        }
      }
    } catch (err) {
      // no-op
    }
  })());
});

// While this SW is still controlling, bypass any cache by fetching from network
self.addEventListener('fetch', (event) => {
  // For navigation requests, try to force a reload
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'reload' }));
    return;
  }
  event.respondWith(fetch(event.request));
});


