import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  if (!isEmailConfigured())
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })

  try {
    const { email } = await req.json()
    if (!email?.trim())
      return NextResponse.json({ error: 'Email required' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default
    const user = await UserModel.findOne({ email: email.toLowerCase() })

    // Always respond with success to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true })
    }

    const verifyToken = crypto.randomBytes(32).toString('hex')
    await UserModel.findByIdAndUpdate(user._id, { verifyToken })

    sendVerificationEmail(user.name, user.email, verifyToken).catch(() => {})
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
