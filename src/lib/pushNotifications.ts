import { supabase } from '@/integrations/supabase/client'

export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY as string

function urlBase64ToUint8Array(
  base64String: string
): Uint8Array {
  const padding =
    '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from(
    [...rawData].map((c) => c.charCodeAt(0))
  )
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker
      .register('/sw.js')
  } catch (err) {
    console.error('SW registration failed', err)
    return null
  }
}

export async function requestNotificationPermission()
  : Promise<boolean> {
  if (!('Notification' in window)) return false
  const permission =
    await Notification.requestPermission()
  return permission === 'granted'
}

export async function subscribeUserToPush(
  userId: string
) {
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window)
  ) return

  try {
    const sw = await navigator.serviceWorker.ready
    let subscription =
      await sw.pushManager.getSubscription()

    if (!subscription) {
      subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            .buffer as ArrayBuffer,
      })
    }

    const json = subscription.toJSON() as {
      endpoint?: string
      keys?: { p256dh?: string; auth?: string }
    }

    if (
      !json.endpoint ||
      !json.keys?.p256dh ||
      !json.keys?.auth
    ) return

    await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        },
        { onConflict: 'endpoint' }
      )
  } catch (err) {
    console.error('Push subscription failed', err)
  }
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return
  try {
    const sw = await navigator.serviceWorker.ready
    const subscription =
      await sw.pushManager.getSubscription()
    if (subscription) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint)
      await subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Push unsubscribe failed', err)
  }
}