import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { getUserFromRequest } from '@/lib/user-auth'
import { syncRating } from '@/lib/review-utils'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  await connectDB()
  const ReviewModel = (await import('@/models/Review')).default
  const body = await req.json()
  const updated = await ReviewModel.findByIdAndUpdate(params.id, body, { new: true, lean: true }) as { targetSlug: string; targetType: 'package' | 'camp' } | null
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  syncRating(updated.targetSlug, updated.targetType).catch(() => {})
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req)
  const user = getUserFromRequest(req)
  if (!admin && !user)
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  await connectDB()
  const ReviewModel = (await import('@/models/Review')).default
  const review = await ReviewModel.findById(params.id)
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!admin && review.userId.toString() !== user!.userId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { targetSlug, targetType } = review
  await ReviewModel.findByIdAndDelete(params.id)
  syncRating(targetSlug, targetType).catch(() => {})
  return NextResponse.json({ success: true })
}
