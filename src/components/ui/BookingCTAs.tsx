'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Phone, Mail } from 'lucide-react'
import { buildWhatsAppUrl, buildEmailUrl } from '@/lib/utils'
import { useSettings } from '@/hooks/useSettings'

interface BookingCTAsProps {
  packageName?: string
  layout?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

export default function BookingCTAs({
  packageName,
  layout = 'horizontal',
  size = 'md',
}: BookingCTAsProps) {
  const { whatsapp, phone, email } = useSettings()
  const whatsappMsg = packageName
    ? `Hello! I'd like to enquire about the *${packageName}* package. Could you please provide more details?`
    : `Hello! I'd like to enquire about your travel packages. Could you please help me?`

  const emailSubject = packageName
    ? `Enquiry: ${packageName}`
    : 'Travel Package Enquiry'

  const emailBody = packageName
    ? `Hello,\n\nI'm interested in the ${packageName} package and would like to know more details.\n\nKind regards`
    : `Hello,\n\nI'd like to enquire about your travel packages.\n\nKind regards`

  const btnSize = {
    sm: 'px-5 py-3 text-xs gap-2',
    md: 'px-7 py-4 text-sm gap-2',
    lg: 'px-8 py-5 text-base gap-3',
  }[size]

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row'} gap-3`}>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={buildWhatsAppUrl(whatsapp, whatsappMsg)}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center ${btnSize} bg-[#25D366] text-white font-medium rounded-sm tracking-wide transition-all duration-300 hover:bg-[#1ebe57] shadow-lg shadow-[#25D366]/20`}
      >
        <MessageCircle size={size === 'lg' ? 20 : 16} />
        <span>WhatsApp</span>
      </motion.a>

      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={`tel:${phone}`}
        className={`inline-flex items-center justify-center ${btnSize} bg-obsidian text-white font-medium rounded-sm tracking-wide transition-all duration-300 hover:bg-obsidian-light border border-white/10`}
      >
        <Phone size={size === 'lg' ? 20 : 16} />
        <span>Call Us</span>
      </motion.a>

      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={buildEmailUrl(email, emailSubject, emailBody)}
        className={`inline-flex items-center justify-center ${btnSize} border border-gold text-gold font-medium rounded-sm tracking-wide transition-all duration-300 hover:bg-gold hover:text-white`}
      >
        <Mail size={size === 'lg' ? 20 : 16} />
        <span>Email</span>
      </motion.a>
    </div>
  )
}
