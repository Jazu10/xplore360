'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[60] md:bottom-6 md:left-6 md:right-auto md:max-w-md"
        >
          <div className="bg-obsidian border border-white/10 shadow-2xl p-6 md:rounded-sm">
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              We use cookies to enhance your browsing experience and analyse site traffic.
              By clicking &quot;Accept&quot;, you consent to our use of cookies in accordance with UK GDPR.{' '}
              <Link href="/privacy" className="text-gold underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
            <div className="flex gap-3">
              <button
                onClick={accept}
                className="flex-1 py-2.5 bg-gold text-white text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="flex-1 py-2.5 border border-white/20 text-white/60 text-sm font-medium tracking-wide hover:border-white/40 hover:text-white/80 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
