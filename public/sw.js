/* Mult Flooring — Service Worker for Web Push (VAPID) */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  let data = {}
  try {
    data = event.data.json()
  } catch {
    data = { title: 'Mult Flooring', body: event.data.text() }
  }

  const title = data.title || 'Mult Flooring'
  const options = {
    body: data.body || 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: data.url || '/dashboard' },
    vibrate: [200, 100, 200],
    tag: data.tag || 'mult-flooring',
    renotify: true,
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url)
        }
      }),
  )
})
