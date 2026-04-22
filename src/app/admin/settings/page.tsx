'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, CheckCircle } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'

interface Settings {
  siteName: string; tagline: string; logoUrl: string
  whatsapp: string; phone: string; email: string; address: string
  socialMedia: { instagram: string; facebook: string }
}

const DEFAULT: Settings = {
  siteName: 'Xplore360', tagline: 'Curated Journeys, Extraordinary Experiences',
  logoUrl: '', whatsapp: '', phone: '', email: '', address: 'London, United Kingdom',
  socialMedia: { instagram: '', facebook: '' },
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json())
      .then((d) => { if (d && !d.error) setForm({ ...DEFAULT, ...d, socialMedia: { ...DEFAULT.socialMedia, ...d.socialMedia } }) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const set = <K extends keyof Settings>(key: K, val: Settings[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      toast.success('Settings saved!')
      setTimeout(() => setSaved(false), 3000)
    } catch { toast.error('Failed to save settings') }
    finally { setSaving(false) }
  }

  const inputCls = "w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors bg-white"

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={28} className="text-gold animate-spin" />
    </div>
  )

  return (
    <form onSubmit={save} className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Settings</h1>
          <p className="text-obsidian/40 text-sm">Site configuration and contact details</p>
        </div>
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Branding */}
        <section className="bg-white border border-obsidian/8 p-8 space-y-5">
          <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Site Name</label>
              <input type="text" value={form.siteName} onChange={(e) => set('siteName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Tagline</label>
              <input type="text" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className={inputCls} />
            </div>
          </div>
          <ImageUpload
            label="Logo (will replace text in Navbar & Footer)"
            value={form.logoUrl}
            onChange={(url) => set('logoUrl', url)}
            folder="xplore360/branding"
          />
          {form.logoUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-obsidian p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logoUrl} alt="Logo preview on dark" className="h-10 w-auto object-contain brightness-0 invert" />
            </motion.div>
          )}
        </section>

        {/* Contact */}
        <section className="bg-white border border-obsidian/8 p-8 space-y-5">
          <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">
                WhatsApp Number
              </label>
              <input type="text" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputCls} placeholder="447700000000 (no + or spaces)" />
              <p className="text-obsidian/30 text-xs mt-1">Country code + number, no spaces, no +</p>
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Phone (Display)</label>
              <input type="text" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+44 7700 000000" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="hello@xplore360.co.uk" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Address</label>
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} placeholder="London, United Kingdom" />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white border border-obsidian/8 p-8 space-y-5">
          <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Instagram URL</label>
              <input type="url" value={form.socialMedia.instagram} onChange={(e) => set('socialMedia', { ...form.socialMedia, instagram: e.target.value })} className={inputCls} placeholder="https://instagram.com/xplore360" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Facebook URL</label>
              <input type="url" value={form.socialMedia.facebook} onChange={(e) => set('socialMedia', { ...form.socialMedia, facebook: e.target.value })} className={inputCls} placeholder="https://facebook.com/xplore360" />
            </div>
          </div>
        </section>

        {/* Email config info */}
        <section className="bg-beige border border-gold/20 p-6">
          <h3 className="font-serif text-lg text-obsidian mb-3">Email Configuration</h3>
          <p className="text-obsidian/60 text-sm leading-relaxed mb-4">
            Email sending is configured via <code className="bg-white px-1.5 py-0.5 text-xs border border-obsidian/10">.env.local</code> — not stored in the database for security.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-obsidian/50 font-mono">
            {['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'BUSINESS_EMAIL'].map((key) => (
              <div key={key} className="bg-white px-3 py-2 border border-obsidian/10">{key}</div>
            ))}
          </div>
        </section>
      </div>
    </form>
  )
}
