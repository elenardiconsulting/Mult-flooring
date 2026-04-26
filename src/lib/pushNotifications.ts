/**
 * Mult Flooring — Web Push Notifications utilities.
 * Service worker registration is guarded so it never runs inside an iframe
 * (Lovable preview) where it would interfere with hot reload.
 */

const isInIframe = (() => {
  try {
    return typeof window !== 'undefined' && window.self !== window.top
  } catch {
    return true
  }
})()

const isPreviewHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('id-preview--') ||
    window.location.hostname.includes('lovableproject.com'))

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null
  if (isInIframe || isPreviewHost) {
    // Avoid registering inside Lovable preview iframes — clean up any prior registrations.
    try {
      const regs = await navigator.serviceWorker.getRegistrations()
      regs.forEach((r) => r.unregister())
    } catch {
      /* noop */
    }
    return null
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js')
    return reg
  } catch (err) {
    console.error('SW registration failed:', err)
    return null
  }
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const opts: NotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  }

  if ('serviceWorker' in navigator && !isInIframe && !isPreviewHost) {
    navigator.serviceWorker.ready
      .then((reg) => reg.showNotification(title, opts))
      .catch(() => {
        try {
          new Notification(title, opts)
        } catch {
          /* noop */
        }
      })
  } else {
    try {
      new Notification(title, opts)
    } catch {
      /* noop */
    }
  }
}
