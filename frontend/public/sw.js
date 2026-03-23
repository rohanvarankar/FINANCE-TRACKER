// ============================================================
// INSTALL — cache core assets so app works offline
// ============================================================
const CACHE_NAME = "trackfin-v1";
const PRECACHE_URLS = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // activate immediately, don't wait for old SW to die
});

// ============================================================
// ACTIVATE — clean up old caches
// ============================================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // delete any old cache versions
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control of all open tabs immediately
});

// ============================================================
// FETCH — network first, fall back to cache
// ============================================================
self.addEventListener("fetch", (event) => {
  // Only handle GET requests, ignore chrome-extension etc.
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(event.request);
      })
  );
});

// ============================================================
// PUSH — show notification
// ============================================================
self.addEventListener("push", function (event) {
  event.waitUntil(
    (async () => {
      let title = "TrackFin";
      let options = {
        body: "You have a new notification.",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-72.png",
        data: { url: "/" },
      };

      if (event.data) {
        try {
          const payload = event.data.json();
          title = payload.title || title;
          options = {
            ...options,
            body: payload.body || options.body,
            icon: payload.icon || options.icon,
            data: { url: payload.url || "/" },
          };
        } catch (err) {
          console.error("[SW] Failed to parse push payload:", err);
        }
      }

      await self.registration.showNotification(title, options);
    })()
  );
});

// ============================================================
// NOTIFICATION CLICK — focus or open app
// ============================================================
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});