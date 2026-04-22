import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, signToken, createAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const valid = await verifyAdminCredentials(username, password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ username, role: 'admin' })
    const cookie = createAuthCookie(token)

    const res = NextResponse.json({ success: true })
    res.cookies.set(cookie)
    return res
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
