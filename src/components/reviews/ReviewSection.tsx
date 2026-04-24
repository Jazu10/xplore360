'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Instagram, LogIn, LogOut, UserPlus, Loader2, X, MessageSquare, KeyRound } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Review {
  _id: string
  userName: string
  rating: number
  comment: string
  instagramUrl?: string
  createdAt: string
}

interface User {
  userId: string
  name: string
  email: string
}

interface ReviewSectionProps {
  targetSlug: string
  targetType: 'package' | 'camp'
  onStatsChange?: (rating: number, count: number) => void
}

type AuthMode = 'login' | 'register'

function getInstagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)
  if (!match) return null
  return `https://www.instagram.com/${match[1]}/${match[2]}/embed`
}

export default function ReviewSection({ targetSlug, targetType, onStatsChange }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rating: 5, comment: '', instagramUrl: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showChangePw, setShowChangePw] = useState(false)
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [changePwLoading, setChangePwLoading] = useState(false)

  const fetchReviews = useCallback(async (p: number, append = false) => {
    try {
      const res = await fetch(
        `/api/reviews?slug=${targetSlug}&type=${targetType}&page=${p}`,
        { cache: 'no-store' }
      )
      const data = await res.json()
      if (append) {
        setReviews((prev) => [...prev, ...data.reviews])
      } else {
        setReviews(data.reviews ?? [])
      }
      setTotal(data.total ?? 0)
      setHasMore(data.hasMore ?? false)
      if (!append && typeof data.userHasReviewed === 'boolean') {
        setUserHasReviewed(data.userHasReviewed)
      }
      if (!append && onStatsChange && typeof data.averageRating === 'number') {
        onStatsChange(data.averageRating, data.total ?? 0)
      }
    } catch {}
  }, [targetSlug, targetType])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchReviews(1),
      fetch('/api/auth/user-me', { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
    ]).then(([, me]) => {
      if (me?.userId) setUser(me)
    }).finally(() => setLoading(false))
  }, [fetchReviews])

  const loadMore = async () => {
    setLoadingMore(true)
    const next = page + 1
    await fetchReviews(next, true)
    setPage(next)
    setLoadingMore(false)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const url = authMode === 'login' ? '/api/auth/user-login' : '/api/auth/register'
      const body = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        // Redirect to resend screen instead of showing a toast for unverified accounts
        if (res.status === 403 && data.error?.includes('verify your email')) {
          setPendingVerification(authForm.email)
          return
        }
        throw new Error(data.error)
      }

      // Registration with email verification required
      if (data.needsVerification) {
        setPendingVerification(authForm.email)
        setAuthForm({ name: '', email: '', password: '' })
        return
      }

      // Successful login (or registration without email service)
      const me = await fetch('/api/auth/user-me', { cache: 'no-store' }).then((r) => r.json())
      setUser(me)
      setShowAuth(false)
      setPendingVerification(null)
      setAuthForm({ name: '', email: '', password: '' })
      toast.success(`Welcome${authMode === 'login' ? ' back' : ''}, ${me.name}!`)
      await fetchReviews(1)
      setPage(1)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleResend = async () => {
    if (!pendingVerification) return
    setResendLoading(true)
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingVerification }),
      })
      toast.success('Verification email resent — check your inbox!')
    } catch {
      toast.error('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/user-logout', { method: 'POST' })
    setUser(null)
    setUserHasReviewed(false)
    setShowForm(false)
    toast.success('Logged out')
  }

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (changePwForm.newPassword !== changePwForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setChangePwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: changePwForm.currentPassword, newPassword: changePwForm.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Password updated!')
      setShowChangePw(false)
      setChangePwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setChangePwLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSlug, targetType, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Review posted!')
      setShowForm(false)
      setForm({ rating: 5, comment: '', instagramUrl: '' })
      setUserHasReviewed(true)
      setPage(1)
      await fetchReviews(1)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-16 border-t border-obsidian/8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl text-obsidian">
            Traveller <span className="italic text-gold">Reviews</span>
          </h2>
          {total > 0 && <p className="text-obsidian/40 text-sm mt-1">{total} review{total !== 1 ? 's' : ''}</p>}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-1">
                <span className="text-sm text-obsidian/60">Hi, {user.name}</span>
                <button
                  onClick={() => setShowChangePw(true)}
                  className="p-1.5 text-obsidian/20 hover:text-obsidian transition-colors"
                  title="Change password"
                >
                  <KeyRound size={13} />
                </button>
              </div>
              {userHasReviewed ? (
                <span className="flex items-center gap-2 text-sm text-green-600 border border-green-200 bg-green-50 px-4 py-2">
                  <Star size={14} className="fill-green-500 text-green-500" /> You&apos;ve reviewed this
                </span>
              ) : (
                <button
                  onClick={() => setShowForm((v) => !v)}
                  className="flex items-center gap-2 bg-gold text-white px-4 py-2 text-sm hover:bg-gold/90 transition-colors"
                >
                  <MessageSquare size={14} /> Write a Review
                </button>
              )}
              <button onClick={handleLogout} className="p-2 text-obsidian/30 hover:text-obsidian transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => { setShowAuth(true); setAuthMode('login') }}
              className="flex items-center gap-2 border border-obsidian/20 text-obsidian/60 px-4 py-2 text-sm hover:border-gold hover:text-gold transition-colors"
            >
              <LogIn size={14} /> Login to Review
            </button>
          )}
        </div>
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && user && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onSubmit={handleSubmit}
            className="bg-beige p-6 mb-8 space-y-4"
          >
            <h3 className="font-serif text-lg text-obsidian">Your Review</h3>
            {/* Stars */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                    <Star size={24} className={n <= form.rating ? 'fill-gold text-gold' : 'text-obsidian/20'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">Your Experience *</label>
              <textarea
                required rows={4} value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white resize-none"
                placeholder="Share your experience with fellow travellers..."
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">
                Instagram Post URL <span className="normal-case text-obsidian/30">(optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <Instagram size={16} className="text-obsidian/30 shrink-0" />
                <input
                  type="url" value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  className="flex-1 border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white"
                  placeholder="https://www.instagram.com/p/..."
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-obsidian text-white px-5 py-2.5 text-sm hover:bg-obsidian/80 transition-colors disabled:opacity-50">
                {submitting && <Loader2 size={13} className="animate-spin" />}
                Post Review
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm text-obsidian/50 hover:text-obsidian border border-obsidian/15 transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {loading ? (
        <div className="flex items-center gap-2 text-obsidian/30 py-8">
          <Loader2 size={16} className="animate-spin" /> Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-obsidian/30">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-serif text-lg">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to share your experience</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 mx-auto border border-obsidian/20 text-obsidian/60 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
          >
            {loadingMore && <Loader2 size={14} className="animate-spin" />}
            Load More Reviews
          </button>
        </div>
      )}

      {/* Auth modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowAuth(false); setPendingVerification(null) } }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm p-8 relative"
            >
              <button onClick={() => { setShowAuth(false); setPendingVerification(null) }} className="absolute top-4 right-4 text-obsidian/30 hover:text-obsidian">
                <X size={18} />
              </button>

              {/* Verification pending screen */}
              {pendingVerification ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={24} className="text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-obsidian mb-2">Check your inbox</h3>
                  <p className="text-obsidian/50 text-sm leading-relaxed mb-4">
                    We sent a verification link to <strong className="text-obsidian">{pendingVerification}</strong>.
                    Click it to activate your account, then come back to log in.
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gold text-white py-2.5 text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 mb-3"
                  >
                    {resendLoading && <Loader2 size={13} className="animate-spin" />}
                    Resend verification email
                  </button>
                  <button
                    onClick={() => { setPendingVerification(null); setAuthMode('login') }}
                    className="text-gold text-sm underline underline-offset-4 hover:text-gold/70 transition-colors"
                  >
                    Already verified? Log in
                  </button>
                </div>
              ) : (
              <>
              <div className="flex gap-1 mb-6 border-b border-obsidian/8">
                {(['login', 'register'] as AuthMode[]).map((m) => (
                  <button key={m} onClick={() => setAuthMode(m)}
                    className={`flex-1 pb-3 text-sm capitalize transition-colors ${authMode === m ? 'border-b-2 border-gold text-obsidian font-medium' : 'text-obsidian/40 hover:text-obsidian'}`}>
                    {m === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Full Name</label>
                    <input required value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                      placeholder="Your name" />
                  </div>
                )}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Email</label>
                  <input required type="email" value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Password</label>
                  <input required type="password" value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                    placeholder={authMode === 'register' ? 'Min 6 characters' : '••••••••'} />
                </div>
                <button type="submit" disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 mt-2">
                  {authLoading && <Loader2 size={14} className="animate-spin" />}
                  {authMode === 'login' ? <><LogIn size={14} /> Login</> : <><UserPlus size={14} /> Create Account</>}
                </button>
                {authMode === 'login' && (
                  <p className="text-center text-xs text-obsidian/40 mt-1">
                    <Link href="/forgot-password" className="hover:text-gold transition-colors" onClick={() => setShowAuth(false)}>
                      Forgot password?
                    </Link>
                  </p>
                )}
              </form>
              </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change password modal */}
      <AnimatePresence>
        {showChangePw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowChangePw(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm p-8 relative"
            >
              <button onClick={() => setShowChangePw(false)} className="absolute top-4 right-4 text-obsidian/30 hover:text-obsidian">
                <X size={18} />
              </button>
              <h2 className="font-serif text-xl text-obsidian mb-6">Change Password</h2>
              <form onSubmit={handleChangePw} className="space-y-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Current Password</label>
                  <input required type="password" value={changePwForm.currentPassword}
                    onChange={(e) => setChangePwForm(f => ({ ...f, currentPassword: e.target.value }))}
                    className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                    placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">New Password</label>
                  <input required type="password" minLength={6} value={changePwForm.newPassword}
                    onChange={(e) => setChangePwForm(f => ({ ...f, newPassword: e.target.value }))}
                    className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                    placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Confirm New Password</label>
                  <input required type="password" value={changePwForm.confirm}
                    onChange={(e) => setChangePwForm(f => ({ ...f, confirm: e.target.value }))}
                    className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                    placeholder="Repeat new password" />
                </div>
                <button type="submit" disabled={changePwLoading}
                  className="w-full flex items-center justify-center gap-2 bg-obsidian text-white py-3 text-sm hover:bg-obsidian/80 transition-colors disabled:opacity-50">
                  {changePwLoading && <Loader2 size={14} className="animate-spin" />}
                  Update Password
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const embedUrl = review.instagramUrl ? getInstagramEmbedUrl(review.instagramUrl) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-obsidian/8 p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-medium text-obsidian">{review.userName}</p>
          <p className="text-obsidian/30 text-xs mt-0.5">
            {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < review.rating ? 'fill-gold text-gold' : 'text-obsidian/15'} />
          ))}
        </div>
      </div>
      <p className="text-obsidian/70 text-sm leading-relaxed">{review.comment}</p>
      {embedUrl && (
        <div className="mt-4 max-w-xs">
          <iframe
            src={embedUrl}
            className="w-full rounded"
            style={{ minHeight: 400, border: 'none' }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </motion.div>
  )
}
