'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4 pt-20">
      <div className="bg-white p-10 max-w-md w-full border border-obsidian/8">
        <Link href="/" className="inline-flex items-center gap-2 text-obsidian/40 text-sm hover:text-obsidian mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {status === 'success' ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-obsidian mb-2">Check your inbox</h1>
            <p className="text-obsidian/50 text-sm leading-relaxed">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. It expires in 1 hour.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-serif text-3xl text-obsidian mb-2">Forgot Password</h1>
              <p className="text-obsidian/50 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-obsidian/15 py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              <button type="submit" disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
                {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
