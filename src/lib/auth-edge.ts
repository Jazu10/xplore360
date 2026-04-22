// Edge Runtime compatible JWT verification (no Node.js APIs)
// Used only by middleware — API routes use the full auth.ts

export const COOKIE_NAME = 'xplore360_admin_token'

function b64urlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  return b64 + '='.repeat((4 - (b64.length % 4)) % 4)
}

export async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    // Must read inside function — module-level process.env is unreliable in Edge Runtime
    const secret = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'

    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [headerB64, payloadB64, signatureB64] = parts

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const sigBytes = Uint8Array.from(atob(b64urlDecode(signatureB64)), (c) => c.charCodeAt(0))
    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, data)
    if (!valid) return false

    const payload = JSON.parse(atob(b64urlDecode(payloadB64)))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}
