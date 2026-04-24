'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setErrorMsg('Passwords do not match.'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus('success')
      setTimeout(() => router.push('/'), 2500)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (!token) {
    return (
      <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-obsidian mb-2">Invalid Link</h1>
        <p className="text-obsidian/50 mb-6">This reset link is missing a token.</p>
        <Link href="/forgot-password" className="text-gold text-sm underline underline-offset-4">Request new link</Link>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-obsidian mb-2">Password Updated</h1>
        <p className="text-obsidian/50">Your password has been changed. Redirecting you home…</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-10 max-w-md w-full border border-obsidian/8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-obsidian mb-2">Set New Password</h1>
        <p className="text-obsidian/50 text-sm">Choose a strong password for your account.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">New Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required minLength={6}
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border border-obsidian/15 py-3 px-4 pr-10 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="Min 6 characters" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian/30 hover:text-obsidian">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-2">Confirm Password</label>
          <input type={showPw ? 'text' : 'password'} required
            value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
            placeholder="Repeat new password" />
        </div>
        {(status === 'error' || errorMsg) && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <button type="submit" disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
          {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4 pt-20">
      <Suspense fallback={
        <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
          <Loader2 size={40} className="text-gold animate-spin mx-auto" />
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
}
