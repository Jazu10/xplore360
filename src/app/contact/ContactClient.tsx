'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { buildWhatsAppUrl, buildEmailUrl } from '@/lib/utils'
import { SITE_NAME } from '@/lib/site-config'
import { useSettings } from '@/hooks/useSettings'

interface EnquiryOption { value: string; label: string; group: string }

export default function ContactClient() {
  const cfg = useSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', message: '', consent: false })
  const [enquiryOptions, setEnquiryOptions] = useState<EnquiryOption[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/packages?limit=100').then(r => r.json()).catch(() => null),
      fetch('/api/camps?limit=100').then(r => r.json()).catch(() => null),
    ]).then(([pkgData, campData]) => {
      const opts: EnquiryOption[] = []
      const pkgs: { title: string }[] = Array.isArray(pkgData) ? pkgData : (pkgData?.packages ?? [])
      const camps: { title: string }[] = Array.isArray(campData) ? campData : (campData?.camps ?? [])
      pkgs.forEach(p => opts.push({ value: p.title, label: p.title, group: 'Packages' }))
      camps.forEach(c => opts.push({ value: c.title, label: c.title, group: 'Camps' }))
      setEnquiryOptions(opts)
    })
  }, [])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try WhatsApp or call us.')
    }
  }

  return (
    <div className="pt-20">
      <section className="relative h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
          alt={`Contact ${cfg.siteName || SITE_NAME}`}
          fill priority className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-obsidian/65" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <span className="text-gold text-xs tracking-[0.35em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-gold" /> Get in Touch <span className="w-8 h-px bg-gold" />
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">Contact Us</h1>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <AnimatedSection direction="right">
            <span className="text-gold text-xs tracking-[0.35em] uppercase flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gold" /> Speak to a Specialist
            </span>
            <h2 className="font-serif text-4xl text-obsidian mb-4">
              We&apos;re Here <span className="italic text-gold">to Help</span>
            </h2>
            <p className="text-obsidian/50 text-lg leading-relaxed mb-10">
              Whether you have a destination in mind or just a dream, our specialists are ready.
              Get in touch — there&apos;s no obligation.
            </p>

            <div className="space-y-5">
              <a href={buildWhatsAppUrl(cfg.whatsapp, "Hello! I'd like to enquire about a travel package.")}
                target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-5 p-6 border border-obsidian/10 hover:border-[#25D366] transition-all">
                <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-1">WhatsApp</p>
                  <p className="font-medium text-obsidian group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                  <p className="text-obsidian/40 text-sm">Usually responds within 1 hour</p>
                </div>
              </a>

              <a href={`tel:${cfg.phone}`}
                className="group flex items-center gap-5 p-6 border border-obsidian/10 hover:border-gold transition-all">
                <div className="w-12 h-12 bg-obsidian flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-1">Phone</p>
                  <p className="font-medium text-obsidian group-hover:text-gold transition-colors">{cfg.phone}</p>
                  <p className="text-obsidian/40 text-sm">Mon–Sat, 9am–7pm</p>
                </div>
              </a>

              <a href={buildEmailUrl(cfg.email, 'Travel Enquiry')}
                className="group flex items-center gap-5 p-6 border border-obsidian/10 hover:border-gold transition-all">
                <div className="w-12 h-12 bg-beige flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-1">Email</p>
                  <p className="font-medium text-obsidian group-hover:text-gold transition-colors">{cfg.email}</p>
                  <p className="text-obsidian/40 text-sm">We reply within 2 hours</p>
                </div>
              </a>

              <div className="flex items-start gap-5 p-6 bg-beige">
                <MapPin size={20} className="text-gold shrink-0 mt-1" />
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-1">Based In</p>
                  <p className="font-medium text-obsidian">{cfg.address}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="left" delay={0.1}>
            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 h-full">
                <CheckCircle size={60} className="text-gold mb-6" />
                <h3 className="font-serif text-3xl text-obsidian mb-3">Thank You!</h3>
                <p className="text-obsidian/50 text-lg max-w-sm">
                  We&apos;ve received your enquiry and will be in touch within 2 hours.
                </p>
                <button onClick={() => setStatus('idle')}
                  className="mt-8 text-gold text-sm underline underline-offset-4">
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Full Name *</label>
                    <input type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Email *</label>
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Phone Number</label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="+44..." />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Package / Camp of Interest</label>
                  {enquiryOptions.length > 0 ? (
                    <select
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                    >
                      <option value="">Select a package or camp…</option>
                      {['Packages', 'Camps'].map(group => {
                        const items = enquiryOptions.filter(o => o.group === group)
                        if (!items.length) return null
                        return (
                          <optgroup key={group} label={group}>
                            {items.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </optgroup>
                        )
                      })}
                    </select>
                  ) : (
                    <input type="text" value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="e.g. Maldives, Dubai, Bali..." />
                  )}
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Your Message *</label>
                  <textarea required rows={5} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us your dream holiday — dates, budget, group size..." />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" required checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-1 accent-gold" />
                  <label htmlFor="consent" className="text-sm text-obsidian/50 leading-relaxed">
                    I consent to {cfg.siteName || SITE_NAME} processing my data to respond to my enquiry, in accordance with UK GDPR and the{' '}
                    <a href="/privacy" className="text-gold underline underline-offset-2">Privacy Policy</a>. *
                  </label>
                </div>

                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-sm p-4">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button type="submit" disabled={status === 'loading' || !form.consent}
                  className="w-full flex items-center justify-center gap-2 btn-luxury disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                  <span>{status === 'loading' ? 'Sending…' : 'Send Enquiry'}</span>
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
