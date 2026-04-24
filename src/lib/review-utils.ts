import { connectDB } from '@/lib/db'

export async function syncRating(targetSlug: string, targetType: 'package' | 'camp') {
  await connectDB()
  const ReviewModel = (await import('@/models/Review')).default

  const agg = await ReviewModel.aggregate([
    { $match: { targetSlug, targetType, approved: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  const avg = agg[0]?.avg ?? 0
  const count = agg[0]?.count ?? 0
  const rating = Math.round(avg * 10) / 10

  if (targetType === 'package') {
    const PackageModel = (await import('@/models/Package')).default
    await PackageModel.findOneAndUpdate({ slug: targetSlug }, { rating, reviewCount: count })
  } else {
    const CampModel = (await import('@/models/Camp')).default
    await CampModel.findOneAndUpdate({ slug: targetSlug }, { rating, reviewCount: count })
  }
}
