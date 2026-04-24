import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { getUserFromRequest } from '@/lib/user-auth'
import { syncRating } from '@/lib/review-utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = 5

  if (!slug || !type)
    return NextResponse.json({ error: 'slug and type required' }, { status: 400 })

  if (!isDBConfigured()) return NextResponse.json({ reviews: [], total: 0, hasMore: false, userHasReviewed: false })

  try {
    await connectDB()
    const ReviewModel = (await import('@/models/Review')).default
    const query = { targetSlug: slug, targetType: type, approved: true }

    const [agg, reviews] = await Promise.all([
      ReviewModel.aggregate([
        { $match: query },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
      ReviewModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ])

    const total: number = agg[0]?.count ?? 0
    const averageRating: number = agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0

    const currentUser = getUserFromRequest(req)
    let userHasReviewed = false
    if (currentUser) {
      userHasReviewed = !!(await ReviewModel.findOne({
        userId: currentUser.userId,
        targetSlug: slug,
        targetType: type,
      }).lean())
    }

    return NextResponse.json({ reviews, total, averageRating, hasMore: page * limit < total, userHasReviewed })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { targetSlug, targetType, rating, comment, instagramUrl } = await req.json()
    if (!targetSlug || !targetType || !rating || !comment?.trim())
      return NextResponse.json({ error: 'slug, type, rating and comment required' }, { status: 400 })

    await connectDB()
    const ReviewModel = (await import('@/models/Review')).default

    const existing = await ReviewModel.findOne({ userId: user.userId, targetSlug, targetType })
    if (existing)
      return NextResponse.json({ error: 'You have already reviewed this' }, { status: 409 })

    const review = await ReviewModel.create({
      userId: user.userId,
      userName: user.name,
      targetSlug,
      targetType,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      instagramUrl: instagramUrl?.trim() || undefined,
    })
    syncRating(targetSlug, targetType).catch(() => {})
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
