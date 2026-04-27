import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ============================================================
// Native Web Push implementation (Deno-compatible, no Node deps)
// Implements RFC 8291 (Web Push) + RFC 8292 (VAPID)
// ============================================================

function b64urlToUint8Array(b64url: string): Uint8Array {
  const padding = '='.repeat((4 - (b64url.length % 4)) % 4)
  const b64 = (b64url + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

function uint8ArrayToB64url(arr: Uint8Array): string {
  let str = ''
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function concatUint8(...arrs: Uint8Array[]): Uint8Array {
  const total = arrs.reduce((sum, a) => sum + a.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const a of arrs) {
    out.set(a, offset)
    offset += a.length
  }
  return out
}

// Convert Uint8Array (which may be backed by SharedArrayBuffer in TS types)
// to a plain ArrayBuffer for Web Crypto APIs
function toBuffer(arr: Uint8Array): ArrayBuffer {
  const buf = new ArrayBuffer(arr.byteLength)
  new Uint8Array(buf).set(arr)
  return buf
}

// Convert raw P-256 public key (65 bytes, 0x04 || X || Y) to JWK
function rawPublicKeyToJwk(raw: Uint8Array): JsonWebKey {
  if (raw.length !== 65 || raw[0] !== 0x04) {
    throw new Error('Invalid raw public key')
  }
  return {
    kty: 'EC',
    crv: 'P-256',
    x: uint8ArrayToB64url(raw.slice(1, 33)),
    y: uint8ArrayToB64url(raw.slice(33, 65)),
    ext: true,
  }
}

// Convert raw P-256 private key (32 bytes) + public key to JWK
function vapidKeysToJwk(privateRaw: Uint8Array, publicRaw: Uint8Array): JsonWebKey {
  const pub = rawPublicKeyToJwk(publicRaw)
  return {
    ...pub,
    d: uint8ArrayToB64url(privateRaw),
    key_ops: ['sign'],
  }
}

// JWT signing for VAPID (ES256 / P-256)
async function signVapidJwt(
  audience: string,
  subject: string,
  publicKeyRaw: Uint8Array,
  privateKeyRaw: Uint8Array,
): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' }
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12h
    sub: subject,
  }

  const enc = new TextEncoder()
  const headerB64 = uint8ArrayToB64url(enc.encode(JSON.stringify(header)))
  const payloadB64 = uint8ArrayToB64url(enc.encode(JSON.stringify(payload)))
  const signingInput = `${headerB64}.${payloadB64}`

  const jwk = vapidKeysToJwk(privateKeyRaw, publicKeyRaw)
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  )

  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    toBuffer(enc.encode(signingInput)),
  )

  return `${signingInput}.${uint8ArrayToB64url(new Uint8Array(sig))}`
}

// HKDF as per RFC 5869, used by Web Push (RFC 8291)
async function hkdf(
  salt: Uint8Array,
  ikm: Uint8Array,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', toBuffer(salt), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const prk = new Uint8Array(await crypto.subtle.sign('HMAC', key, toBuffer(ikm)))
  const prkKey = await crypto.subtle.importKey('raw', toBuffer(prk), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const infoWith01 = concatUint8(info, new Uint8Array([0x01]))
  const t = new Uint8Array(await crypto.subtle.sign('HMAC', prkKey, toBuffer(infoWith01)))
  return t.slice(0, length)
}

// Encrypt payload using aes128gcm content encoding (RFC 8188 + RFC 8291)
async function encryptPayload(
  payload: Uint8Array,
  userPublicKeyRaw: Uint8Array, // p256dh, 65 bytes
  userAuth: Uint8Array, // 16 bytes
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKeyRaw: Uint8Array }> {
  // Generate ephemeral ECDH key pair (server)
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  ) as CryptoKeyPair

  const serverPublicJwk = await crypto.subtle.exportKey('jwk', serverKeyPair.publicKey)
  const serverPublicRaw = concatUint8(
    new Uint8Array([0x04]),
    b64urlToUint8Array(serverPublicJwk.x!),
    b64urlToUint8Array(serverPublicJwk.y!),
  )

  // Import user public key for ECDH
  const userPublicJwk = rawPublicKeyToJwk(userPublicKeyRaw)
  const userPublicKey = await crypto.subtle.importKey(
    'jwk',
    userPublicJwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  )

  // ECDH shared secret
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: userPublicKey },
    serverKeyPair.privateKey,
    256,
  )
  const ecdhSecret = new Uint8Array(sharedBits)

  // PRK_key per RFC 8291 §3.3
  const enc = new TextEncoder()
  const keyInfo = concatUint8(
    enc.encode('WebPush: info\0'),
    userPublicKeyRaw,
    serverPublicRaw,
  )
  const ikm = await hkdf(userAuth, ecdhSecret, keyInfo, 32)

  // Random 16-byte salt
  const salt = crypto.getRandomValues(new Uint8Array(16))

  // Derive content encryption key (CEK) and nonce per RFC 8188
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16)
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12)

  // Pad payload: append 0x02 delimiter (single record, last record)
  const padded = concatUint8(payload, new Uint8Array([0x02]))

  // AES-128-GCM encryption
  const cekKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt'])
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, cekKey, padded),
  )

  // Build aes128gcm content body: salt (16) || rs (4, BE) || idlen (1) || keyid (idlen) || ciphertext
  // For Web Push, keyid is the server's public key (65 bytes, raw)
  const recordSize = 4096
  const rsBytes = new Uint8Array(4)
  new DataView(rsBytes.buffer).setUint32(0, recordSize, false)
  const keyid = serverPublicRaw
  const header = concatUint8(salt, rsBytes, new Uint8Array([keyid.length]), keyid)
  const body = concatUint8(header, ciphertext)

  return { ciphertext: body, salt, serverPublicKeyRaw: serverPublicRaw }
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicRaw: Uint8Array,
  vapidPrivateRaw: Uint8Array,
  vapidSubject: string,
): Promise<Response> {
  const url = new URL(subscription.endpoint)
  const audience = `${url.protocol}//${url.host}`

  const jwt = await signVapidJwt(audience, vapidSubject, vapidPublicRaw, vapidPrivateRaw)
  const vapidPublicB64 = uint8ArrayToB64url(vapidPublicRaw)

  const userPublicKeyRaw = b64urlToUint8Array(subscription.p256dh)
  const userAuth = b64urlToUint8Array(subscription.auth)

  const enc = new TextEncoder()
  const { ciphertext: body } = await encryptPayload(
    enc.encode(payload),
    userPublicKeyRaw,
    userAuth,
  )

  return await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      'Authorization': `vapid t=${jwt}, k=${vapidPublicB64}`,
    },
    body,
  })
}

// ============================================================
// Edge Function entrypoint
// ============================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, title, body } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (error) throw error

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, failed: 0, message: 'No subscriptions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const vapidPublicB64 = Deno.env.get('VAPID_PUBLIC_KEY')!
    const vapidPrivateB64 = Deno.env.get('VAPID_PRIVATE_KEY')!
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@multflooring.com'

    const vapidPublicRaw = b64urlToUint8Array(vapidPublicB64)
    const vapidPrivateRaw = b64urlToUint8Array(vapidPrivateB64)

    const payload = JSON.stringify({
      title: title || 'Mult Flooring',
      body: body || 'New notification',
      url: '/dashboard',
      tag: leadId || 'mult-flooring',
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        const res = await sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payload,
          vapidPublicRaw,
          vapidPrivateRaw,
          vapidSubject,
        )

        if (!res.ok) {
          // Clean up dead subscriptions
          if (res.status === 410 || res.status === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint)
          }
          throw new Error(`Push failed: ${res.status} ${await res.text()}`)
        }
        return { endpoint: sub.endpoint, status: res.status }
      }),
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r: any) => r.reason?.message || String(r.reason))

    return new Response(
      JSON.stringify({ sent, failed, errors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('send-push error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
