'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Trash2, Loader2, Check, X, Instagram, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface Review {
  _id: string
  userName: string
  targetSlug: string
  targetType: 'package' | 'camp'
  rating: number
  comment: string
  instagramUrl?: string
  approved: boolean
  createdAt: string
}

type Filter = 'all' | 'pending' | 'approved'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async (f: Filter, p: number, append = false) => {
    if (!append) setLoading(true)
    try {
      const res = await fetch(`/api/admin/reviews?filter=${f}&page=${p}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (append) {
        setReviews(prev => [...prev, ...data.reviews])
      } else {
        setReviews(data.reviews)
      }
      setTotal(data.total)
      setHasMore(data.hasMore)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    load(filter, 1)
  }, [filter, load])

  const loadMore = async () => {
    const next = page + 1
    await load(filter, next, true)
    setPage(next)
  }

  const approve = async (id: string, currentlyApproved: boolean) => {
    setActionId(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !currentlyApproved }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(currentlyApproved ? 'Review hidden' : 'Review approved')
      setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: !currentlyApproved } : r))
      setTotal(t => t)
    } catch {
      toast.error('Failed to update')
    } finally {
      setActionId(null)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return
    setActionId(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Review deleted')
      setReviews(prev => prev.filter(r => r._id !== id))
      setTotal(t => t - 1)
    } catch {
      toast.error('Failed to delete')
    } finally {
      setActionId(null)
    }
  }

  const pendingCount = reviews.filter(r => !r.approved).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Reviews</h1>
          <p className="text-obsidian/40 text-sm">{total} total · {pendingCount} pending approval</p>
        </div>
        <button onClick={() => load(filter, 1)} className="flex items-center gap-2 text-obsidian/40 hover:text-obsidian text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-obsidian/10">
        {(['all', 'pending', 'approved'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2.5 text-sm capitalize transition-colors ${filter === f ? 'border-b-2 border-gold text-obsidian font-medium' : 'text-obsidian/40 hover:text-obsidian'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-obsidian/30">
          <Star size={36} className="mx-auto mb-3 opacity-20" />
          <p className="font-serif text-xl">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div key={review._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white border p-6 ${review.approved ? 'border-obsidian/8' : 'border-amber-200 bg-amber-50/30'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-medium text-obsidian">{review.userName}</span>
                    <span className="text-xs text-obsidian/40 border border-obsidian/10 px-2 py-0.5 capitalize">
                      {review.targetType}: {review.targetSlug}
                    </span>
                    {!review.approved && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-medium">
                        Pending
                      </span>
                    )}
                    {review.instagramUrl && (
                      <span className="flex items-center gap-1 text-xs text-pink-500">
                        <Instagram size={11} /> Instagram
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} className={j < review.rating ? 'fill-gold text-gold' : 'text-obsidian/15'} />
                    ))}
                    <span className="text-obsidian/30 text-xs ml-2">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-obsidian/70 text-sm leading-relaxed">{review.comment}</p>

                  {review.instagramUrl && (
                    <a href={review.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs text-pink-500 hover:underline">
                      <Instagram size={12} /> View Instagram post
                    </a>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approve(review._id, review.approved)}
                    disabled={actionId === review._id}
                    title={review.approved ? 'Hide review' : 'Approve review'}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
                      review.approved
                        ? 'border border-obsidian/15 text-obsidian/50 hover:border-amber-400 hover:text-amber-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {actionId === review._id
                      ? <Loader2 size={12} className="animate-spin" />
                      : review.approved ? <X size={12} /> : <Check size={12} />
                    }
                    {review.approved ? 'Hide' : 'Approve'}
                  </button>
                  <button
                    onClick={() => deleteReview(review._id)}
                    disabled={actionId === review._id}
                    className="p-2 text-obsidian/30 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button onClick={loadMore}
            className="border border-obsidian/20 text-obsidian/60 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
