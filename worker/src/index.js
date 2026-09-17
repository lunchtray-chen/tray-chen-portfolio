/*
 * Password gate for the Artifex portfolio entries.
 *
 * Routes:
 *   POST /unlock          { password }        -> { token, exp }
 *   GET  /project/:slug   Bearer token        -> full project record (gated text + asset keys)
 *   GET  /asset/<key>     Bearer token        -> image bytes streamed from the private R2 bucket
 *
 * Nothing here is ever shipped to the browser except what these routes return, and none of
 * the protected assets have a public URL. See README.md for setup.
 */

/* ---------- config ---------- */

const ALLOWED_ORIGINS = ['https://traychen.com', 'https://www.traychen.com']

/*
 * Any localhost port, because Vite hops to 5174, 5175... whenever 5173 is taken.
 *
 * Safe to allow in production: CORS only governs what a *browser* lets one page read
 * from another origin, and it stops nobody using curl. Since the unlock token lives in
 * localStorage rather than a cookie, a page on someone's localhost has no credentials of
 * a visitor's to borrow. Every route still demands the password or a valid token.
 */
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/

function originAllowed(origin) {
  return ALLOWED_ORIGINS.includes(origin) || LOCALHOST_ORIGIN.test(origin)
}

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

const UNLOCK_ATTEMPTS_PER_HOUR = 10
const UNLOCK_DELAY_MS = 250 // fixed delay on every attempt, success or not

/*
 * PBKDF2 iteration count.
 *
 * Kept deliberately low because the Workers free plan caps CPU at 10ms per request and
 * PBKDF2 burns CPU by design. This is acceptable here: the hash lives in a Worker secret
 * and is never served to anyone, so there is nothing to brute-force offline. The real
 * defence against guessing is the per-IP rate limit below.
 *
 * If this ever moves to the paid plan (30s CPU), raise this to 600000 and regenerate the
 * hash with scripts/hash-password.mjs.
 */
const PBKDF2_ITERATIONS = 20000

/*
 * The gated half of each protected project. The public half (name, short description,
 * keywords, card thumbnail) stays in src/components/projectData.js.
 *
 * Every image value is an R2 object key, not a URL. Upload matching files with
 * scripts/upload-assets.sh, then keep the two in sync.
 */
const PROTECTED_PROJECTS = {
  'artifex-uiux': {
    timeframe: 'June 2026 - Sept 2026',
    tools: 'Figma, Clip Studio Paint, OpenAI Codex',
    longdesc: 'so much stuff',
    imgsrc: 'artifex/uiux/hero.webp',
    halfsrc: 'artifex/half.svg',
    imgseries: [
      'artifex/uiux/01.webp',
      'artifex/uiux/02.webp',
      'artifex/uiux/03.webp',
    ],
  },

  'artifex-physical': {
    timeframe: 'June 2026 - Sept 2026',
    tools: 'Figma, Clip Studio Paint, Sketchbook',
    longdesc: 'so much stuff',
    imgsrc: 'artifex/physical/hero.webp',
    halfsrc: 'artifex/half.svg',
    imgseries: [
      'artifex/physical/01.webp',
      'artifex/physical/02.webp',
      'artifex/physical/03.webp',
    ],
  },

  'artifex-illustration': {
    timeframe: 'June 2026 - Sept 2026',
    tools: 'Clip Studio Paint, Sketchbook',
    longdesc: 'Illustration yuh',
    imgsrc: 'artifex/illustration/hero.webp',
    halfsrc: 'artifex/half.svg',
    imgseries: [
      'artifex/illustration/01.webp',
      'artifex/illustration/02.webp',
      'artifex/illustration/03.webp',
    ],
  },
}

/* Only keys under these prefixes can ever be served. */
const ALLOWED_ASSET_PREFIXES = ['artifex/']

/* Fallback when R2 has no stored content type — the browser renders these from blob:
   URLs, where an empty type is left to content sniffing. */
const CONTENT_TYPES = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
}

/* ---------- small helpers ---------- */

const encoder = new TextEncoder()

function corsHeaders(request) {
  const origin = request.headers.get('Origin')
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
  if (origin && originAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function json(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  })
}

function unauthorized(request) {
  return json({ error: 'unauthorized' }, 401, request)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function base64urlEncode(bytes) {
  let binary = ''
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/* Compares without leaking where the first difference is. */
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/* ---------- password ---------- */

async function derivePasswordHash(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

/* ---------- tokens ---------- */

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

async function signToken(exp, secret) {
  const payload = base64urlEncode(encoder.encode(JSON.stringify({ exp })))
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload))
  return `${payload}.${base64urlEncode(signature)}`
}

/* Returns true only for a well-formed, correctly signed, unexpired token. */
async function verifyToken(token, secret) {
  if (typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, signature] = parts

  let expected
  try {
    expected = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload))
  } catch {
    return false
  }

  let provided
  try {
    provided = base64urlDecode(signature)
  } catch {
    return false
  }
  if (!constantTimeEqual(new Uint8Array(expected), provided)) return false

  try {
    const { exp } = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)))
    return typeof exp === 'number' && exp * 1000 > Date.now()
  } catch {
    return false
  }
}

async function requireToken(request, env) {
  const header = request.headers.get('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return false
  return verifyToken(token, env.TOKEN_SECRET)
}

/* ---------- rate limiting ---------- */

/* Rolling hourly bucket per IP, stored in KV. Fails open only if KV itself errors. */
async function overRateLimit(env, ip) {
  if (!env.RATE) return false // KV not bound (e.g. bare local dev) — skip rather than lock out
  const key = `unlock:${ip}`
  try {
    const current = parseInt((await env.RATE.get(key)) || '0', 10)
    if (current >= UNLOCK_ATTEMPTS_PER_HOUR) return true
    await env.RATE.put(key, String(current + 1), { expirationTtl: 3600 })
    return false
  } catch {
    return false
  }
}

/* ---------- routes ---------- */

async function handleUnlock(request, env) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400, request)
  }

  const password = body?.password
  if (typeof password !== 'string' || password.length === 0 || password.length > 256) {
    return json({ error: 'bad_request' }, 400, request)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (await overRateLimit(env, ip)) {
    return json({ error: 'rate_limited' }, 429, request)
  }

  // Same delay whether the password is right or wrong, so timing says nothing.
  await sleep(UNLOCK_DELAY_MS)

  const derived = await derivePasswordHash(password, env.PASSWORD_SALT)
  const stored = hexToBytes(env.PASSWORD_HASH)
  if (!constantTimeEqual(derived, stored)) {
    return json({ error: 'invalid_password' }, 401, request)
  }

  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  return json({ token: await signToken(exp, env.TOKEN_SECRET), exp }, 200, request)
}

async function handleProject(request, env, slug) {
  if (!(await requireToken(request, env))) return unauthorized(request)

  const project = PROTECTED_PROJECTS[slug]
  if (!project) return json({ error: 'not_found' }, 404, request)

  return new Response(JSON.stringify(project), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
      ...corsHeaders(request),
    },
  })
}

async function handleAsset(request, env, key) {
  if (!(await requireToken(request, env))) return unauthorized(request)

  const decoded = decodeURIComponent(key)
  if (decoded.includes('..') || !ALLOWED_ASSET_PREFIXES.some((p) => decoded.startsWith(p))) {
    return json({ error: 'not_found' }, 404, request)
  }

  const object = await env.ASSETS.get(decoded)
  if (!object) return json({ error: 'not_found' }, 404, request)

  const headers = new Headers(corsHeaders(request))
  object.writeHttpMetadata(headers)
  if (!headers.has('Content-Type')) {
    const extension = decoded.split('.').pop().toLowerCase()
    headers.set('Content-Type', CONTENT_TYPES[extension] || 'application/octet-stream')
  }
  headers.set('Cache-Control', 'private, max-age=3600')
  headers.set('etag', object.httpEtag)
  return new Response(object.body, { headers })
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    if (request.method === 'POST' && pathname === '/unlock') {
      return handleUnlock(request, env)
    }

    if (request.method === 'GET' && pathname.startsWith('/project/')) {
      return handleProject(request, env, pathname.slice('/project/'.length))
    }

    if (request.method === 'GET' && pathname.startsWith('/asset/')) {
      return handleAsset(request, env, pathname.slice('/asset/'.length))
    }

    return json({ error: 'not_found' }, 404, request)
  },
}
