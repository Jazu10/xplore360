'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, X } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'
import siteConfig from '@/data/config.json'

interface StickyBookingProps {
  packageName?: string
}

export default function StickyBooking({ packageName }: StickyBookingProps) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const whatsappMsg = packageName
    ? `Hello! I'd like to enquire about the *${packageName}* package.`
    : `Hello! I'd like to enquire about a travel package.`

  return (
    <>
      {/* Mobile sticky bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-2xl"
          >
            <div className="flex">
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white text-sm font-medium"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-obsidian text-white text-sm font-medium"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop floating button */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="flex flex-col gap-2 items-end"
                >
                  <a
                    href={buildWhatsAppUrl(siteConfig.whatsapp, whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full text-sm font-medium shadow-xl shadow-[#25D366]/30 hover:bg-[#1ebe57] transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-3 bg-obsidian text-white px-5 py-3 rounded-full text-sm font-medium shadow-xl hover:bg-obsidian-light transition-colors"
                  >
                    <Phone size={16} />
                    {siteConfig.phone}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-xl shadow-gold/40 hover:bg-gold-dark transition-colors"
              aria-label="Contact options"
            >
              <AnimatePresence mode="wait">
                {expanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageCircle size={20} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
