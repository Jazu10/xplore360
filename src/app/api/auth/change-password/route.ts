import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { comparePassword, hashPassword } from '@/lib/auth'
import { getUserFromRequest } from '@/lib/user-auth'

export async function POST(req: NextRequest) {
  const userPayload = getUserFromRequest(req)
  if (!userPayload)
    return NextResponse.json({ error: 'Login required' }, { status: 401 })

  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword)
      return NextResponse.json({ error: 'Current and new password required' }, { status: 400 })
    if (newPassword.length < 6)
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })

    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const user = await UserModel.findById(userPayload.userId)
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!(await comparePassword(currentPassword, user.passwordHash)))
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

    await UserModel.findByIdAndUpdate(user._id, {
      passwordHash: await hashPassword(newPassword),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
