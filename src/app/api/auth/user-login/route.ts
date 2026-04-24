import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { comparePassword } from '@/lib/auth'
import { signUserToken, createUserCookie } from '@/lib/user-auth'

export async function POST(req: NextRequest) {
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { email, password } = await req.json()
    if (!email?.trim() || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user || !(await comparePassword(password, user.passwordHash)))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    if (user.status === 'blacklisted')
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 })

    if (!user.emailVerified)
      return NextResponse.json({ error: 'Please verify your email before logging in. Check your inbox for the verification link.' }, { status: 403 })

    const token = signUserToken({ userId: user._id.toString(), email: user.email, name: user.name })
    const res = NextResponse.json({ _id: user._id, name: user.name, email: user.email })
    res.cookies.set(createUserCookie(token))
    return res
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
