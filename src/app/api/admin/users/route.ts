import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ users: [], total: 0 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') // 'active' | 'blacklisted'
  const search = searchParams.get('search')
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = 25

  try {
    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]

    const total = await UserModel.countDocuments(query)
    const users = await UserModel.find(query)
      .select('-passwordHash -verifyToken -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({ users, total, hasMore: page * limit < total })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
