/* Talks to the password gate Worker (see worker/README.md). */

// Set VITE_API_BASE=http://localhost:8787 in .env.local to develop against `wrangler dev`.
export const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://traychen-gate.traychen-portfolio.workers.dev'

const STORAGE_KEY = 'artifex-unlock'

/* Returns the stored token, or null if there isn't one or it has expired. */
export function readToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { token, exp } = JSON.parse(raw)
    if (!token || !exp || exp * 1000 <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return token
  } catch {
    return null
  }
}

export function storeToken(token, exp) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, exp }))
  } catch {
    /* private browsing — the unlock just won't survive a reload */
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to do */
  }
}

/* Thrown for any non-OK response so callers can branch on `status` (401 => re-prompt). */
export class ApiError extends Error {
  constructor(status, code) {
    super(code || `http_${status}`)
    this.status = status
    this.code = code
  }
}

export async function requestUnlock(password) {
  const response = await fetch(`${API_BASE}/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(response.status, body.error)
  return body // { token, exp }
}

export async function fetchProject(slug, token) {
  const response = await fetch(`${API_BASE}/project/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new ApiError(response.status)
  return response.json()
}

/* Returns a blob: URL. The caller owns it and must revokeObjectURL when done. */
export async function fetchAsset(assetKey, token) {
  // encode per segment so keys with spaces or other odd characters survive, while the
  // slashes stay real path separators
  const path = assetKey.split('/').map(encodeURIComponent).join('/')
  const response = await fetch(`${API_BASE}/asset/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new ApiError(response.status)
  return URL.createObjectURL(await response.blob())
}
