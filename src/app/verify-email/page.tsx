'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setStatus('success')
        else { setStatus('error'); setMessage(d.error || 'Verification failed.') }
      })
      .catch(() => { setStatus('error'); setMessage('Something went wrong.') })
  }, [token])

  return (
    <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
      {status === 'loading' && (
        <>
          <Loader2 size={40} className="text-gold animate-spin mx-auto mb-4" />
          <p className="text-obsidian/60">Verifying your email…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-obsidian mb-2">Email Verified!</h1>
          <p className="text-obsidian/50 mb-6">Your email address has been confirmed. You can now post reviews.</p>
          <Link href="/" className="inline-block bg-gold text-white px-6 py-3 text-sm hover:bg-gold/90 transition-colors">
            Back to Home
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-obsidian mb-2">Verification Failed</h1>
          <p className="text-obsidian/50 mb-6">{message}</p>
          <Link href="/" className="inline-block border border-obsidian/20 text-obsidian/60 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors">
            Back to Home
          </Link>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4">
      <Suspense fallback={
        <div className="bg-white p-10 max-w-md w-full text-center border border-obsidian/8">
          <Loader2 size={40} className="text-gold animate-spin mx-auto mb-4" />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
