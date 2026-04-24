import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { signUserToken, createUserCookie } from '@/lib/user-auth'
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { name, email, password } = await req.json()
    if (!name?.trim() || !email?.trim() || !password)
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const existing = await UserModel.findOne({ email: email.toLowerCase() })
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const emailServiceReady = isEmailConfigured()
    const verifyToken = emailServiceReady ? crypto.randomBytes(32).toString('hex') : undefined

    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: await hashPassword(password),
      // Auto-verify when no email service is configured so the site stays usable
      emailVerified: !emailServiceReady,
      verifyToken,
    })

    if (emailServiceReady && verifyToken) {
      sendVerificationEmail(user.name, user.email, verifyToken).catch(() => {})
      // Don't set a session cookie — user must verify before logging in
      return NextResponse.json({ needsVerification: true }, { status: 201 })
    }

    // No email service: log the user in immediately
    const token = signUserToken({ userId: user._id.toString(), email: user.email, name: user.name })
    const res = NextResponse.json({ _id: user._id, name: user.name, email: user.email }, { status: 201 })
    res.cookies.set(createUserCookie(token))
    return res
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
