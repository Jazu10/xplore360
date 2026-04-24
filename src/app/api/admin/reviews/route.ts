import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ reviews: [], total: 0 })

  const { searchParams } = req.nextUrl
  const filter = searchParams.get('filter') // 'all' | 'pending' | 'approved'
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = 20

  try {
    await connectDB()
    const ReviewModel = (await import('@/models/Review')).default
    const query: Record<string, unknown> = {}
    if (filter === 'pending') query.approved = false
    else if (filter === 'approved') query.approved = true

    const total = await ReviewModel.countDocuments(query)
    const reviews = await ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    return NextResponse.json({ reviews, total, hasMore: page * limit < total })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
