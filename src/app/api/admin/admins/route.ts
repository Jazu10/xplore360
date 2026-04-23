import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import AdminModel from '@/models/Admin'
import { getAdminFromRequest, hashPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  await connectDB()
  const admins = await AdminModel.find({}, { passwordHash: 0 }).lean()
  return NextResponse.json(admins)
}

export async function POST(req: NextRequest) {
  const caller = getAdminFromRequest(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { username, password, email, role } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })

  // Only superadmins can create superadmins
  if (role === 'superadmin' && caller.role !== 'superadmin')
    return NextResponse.json({ error: 'Only superadmins can create superadmin accounts' }, { status: 403 })

  await connectDB()
  const exists = await AdminModel.findOne({ username: username.toLowerCase() })
  if (exists) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })

  const admin = await AdminModel.create({
    username: username.toLowerCase(),
    passwordHash: await hashPassword(password),
    email: email || undefined,
    role: role || 'admin',
  })

  return NextResponse.json({ _id: admin._id, username: admin.username, email: admin.email, role: admin.role }, { status: 201 })
}
