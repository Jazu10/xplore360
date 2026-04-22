// Edge Runtime compatible JWT verification (no Node.js APIs)
// Used only by middleware — API routes use the full auth.ts

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
export const COOKIE_NAME = 'xplore360_admin_token'

export async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [headerB64, payloadB64, signatureB64] = parts

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode base64url signature
    const sig = signatureB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = sig + '='.repeat((4 - (sig.length % 4)) % 4)
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))

    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, data)
    if (!valid) return false

    // Check expiry
    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/') + '==')
    const payload = JSON.parse(payloadJson)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}
