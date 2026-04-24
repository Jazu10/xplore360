import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { token, password } = await req.json()
    if (!token || !password)
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user)
      return NextResponse.json({ error: 'Invalid or expired reset link. Please request a new one.' }, { status: 400 })

    await UserModel.findByIdAndUpdate(user._id, {
      passwordHash: await hashPassword(password),
      $unset: { resetToken: '', resetTokenExpiry: '' },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
