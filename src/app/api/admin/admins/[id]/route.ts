import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import AdminModel from '@/models/Admin'
import { getAdminFromRequest, hashPassword } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const caller = getAdminFromRequest(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { password, email, role } = await req.json()
  await connectDB()

  const target = await AdminModel.findById(params.id)
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Admins cannot edit superadmin accounts
  if (target.role === 'superadmin' && caller.role !== 'superadmin')
    return NextResponse.json({ error: 'Only superadmins can edit superadmin accounts' }, { status: 403 })

  // Admins cannot promote to superadmin
  if (role === 'superadmin' && caller.role !== 'superadmin')
    return NextResponse.json({ error: 'Only superadmins can assign the superadmin role' }, { status: 403 })

  const update: Record<string, string> = {}
  if (password) update.passwordHash = await hashPassword(password)
  if (email !== undefined) update.email = email
  if (role) update.role = role

  const updated = await AdminModel.findByIdAndUpdate(params.id, update, { new: true, select: '-passwordHash' })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const caller = getAdminFromRequest(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  await connectDB()

  const target = await AdminModel.findById(params.id)
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Admins cannot delete superadmin accounts
  if (target.role === 'superadmin' && caller.role !== 'superadmin')
    return NextResponse.json({ error: 'Only superadmins can delete superadmin accounts' }, { status: 403 })

  const remaining = await AdminModel.countDocuments()
  if (remaining <= 1) return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 })

  await AdminModel.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
