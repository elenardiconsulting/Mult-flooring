/* Mult Flooring — Service Worker for Push Notifications */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (_) {
    data = { body: event.data ? event.data.text() : '' }
  }
  const title = data.title || 'Mult Flooring'
  const options = {
    body: data.body || 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url || '/dashboard',
    vibrate: [200, 100, 200],
    tag: data.tag || 'mult-flooring',
    renotify: true,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data || '/dashboard'
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of allClients) {
        if ('focus' in client) {
          try {
            await client.focus()
            if ('navigate' in client) await client.navigate(target)
            return
          } catch (_) {}
        }
      }
      if (self.clients.openWindow) await self.clients.openWindow(target)
    })()
  )
})
