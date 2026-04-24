import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { sendPasswordResetEmail, isEmailConfigured } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { email } = await req.json()
    if (!email?.trim())
      return NextResponse.json({ error: 'Email required' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    // Always return success to avoid email enumeration
    if (!user) return NextResponse.json({ success: true })

    if (user.status === 'blacklisted')
      return NextResponse.json({ success: true }) // silently ignore

    if (!isEmailConfigured())
      return NextResponse.json({ error: 'Email service not configured. Please contact support.' }, { status: 503 })

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await UserModel.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiry })
    await sendPasswordResetEmail(user.name, user.email, resetToken)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
