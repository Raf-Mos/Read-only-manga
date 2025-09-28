// Minimal service worker to silence /sw.js 404s and remove any previous SW
// This will immediately activate and then unregister itself.

self.addEventListener('install', () => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Unregister this service worker so the app runs without a SW
      await self.registration.unregister();
      // Refresh open clients so they are no longer controlled by a SW
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        // Trigger a reload to detach SW control
        client.navigate(client.url);
      }
    } catch (err) {
      // no-op
    }
  })());
});

// No fetch handlers — this SW does nothing and unregisters itself.
