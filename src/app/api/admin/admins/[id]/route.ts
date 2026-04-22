import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import AdminModel from '@/models/Admin'
import { getAdminFromRequest, hashPassword } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { password, email, role } = await req.json()
  await connectDB()

  const update: Record<string, string> = {}
  if (password) update.passwordHash = await hashPassword(password)
  if (email !== undefined) update.email = email
  if (role) update.role = role

  const admin = await AdminModel.findByIdAndUpdate(params.id, update, { new: true, select: '-passwordHash' })
  if (!admin) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(admin)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  await connectDB()
  const remaining = await AdminModel.countDocuments()
  if (remaining <= 1) return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 })

  await AdminModel.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
