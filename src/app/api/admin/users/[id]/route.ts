import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const UserModel = (await import('@/models/User')).default
    const body = await req.json()

    const allowed: Record<string, unknown> = {}
    if (body.status !== undefined) allowed.status = body.status
    if (body.emailVerified !== undefined) allowed.emailVerified = body.emailVerified

    const user = await UserModel.findByIdAndUpdate(
      params.id,
      { $set: allowed },
      { new: true, lean: true }
    ).select('-passwordHash -verifyToken -resetToken -resetTokenExpiry')

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const UserModel = (await import('@/models/User')).default
    const deleted = await UserModel.findByIdAndDelete(params.id)
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
