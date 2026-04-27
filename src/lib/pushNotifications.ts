/**
 * Mult Flooring — Web Push (VAPID) utilities.
 * Service worker registration is guarded so it never runs inside a Lovable
 * preview iframe where it would interfere with hot reload.
 */

import { supabase } from '@/integrations/supabase/client'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

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

const shouldSkipServiceWorker = isInIframe || isPreviewHost

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null
  if (shouldSkipServiceWorker) {
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

const saveSubscription = async (subscription: PushSubscription) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const sub = subscription.toJSON()
  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) return

  await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      { onConflict: 'endpoint' },
    )
}

export const subscribeUserToPush = async (): Promise<boolean> => {
  if (shouldSkipServiceWorker) return false
  if (!VAPID_PUBLIC_KEY) {
    console.warn('VITE_VAPID_PUBLIC_KEY is not set — cannot subscribe to push.')
    return false
  }
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false

  try {
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') return false

    const registration = await navigator.serviceWorker.ready

    const existing = await registration.pushManager.getSubscription()
    if (existing) {
      await saveSubscription(existing)
      return true
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    await saveSubscription(subscription)
    return true
  } catch (err) {
    console.error('Push subscription failed:', err)
    return false
  }
}

export const unsubscribeFromPush = async (): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint)
      await subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Unsubscribe failed:', err)
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

  if ('serviceWorker' in navigator && !shouldSkipServiceWorker) {
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
