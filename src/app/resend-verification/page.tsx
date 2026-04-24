'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle, Mail } from 'lucide-react'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige px-4 pt-20">
        <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-obsidian mb-2">Email Sent</h1>
          <p className="text-obsidian/50 text-sm mb-6">
            If <strong className="text-obsidian">{email}</strong> is registered and unverified, a new verification link is on its way.
          </p>
          <Link href="/" className="text-gold text-sm underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4 pt-20">
      <div className="bg-white p-10 max-w-md w-full border border-obsidian/8">
        <div className="mb-8">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-4">
            <Mail size={22} className="text-gold" />
          </div>
          <h1 className="font-serif text-3xl text-obsidian mb-2">Resend Verification</h1>
          <p className="text-obsidian/50 text-sm">Enter your email and we&apos;ll send a new confirmation link.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Send Verification Email
          </button>
        </form>
        <p className="text-center text-obsidian/40 text-xs mt-6">
          Already verified?{' '}
          <button onClick={() => window.history.back()} className="text-gold underline underline-offset-4">Go back</button>
        </p>
      </div>
    </div>
  )
}
