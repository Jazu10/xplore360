'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, MessageSquare, Mail, Image, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'

interface Stats {
  packages: number
  testimonials: number
  inquiries: number
  newInquiries: number
  media: number
}

interface Inquiry {
  _id: string
  name: string
  email: string
  packageName?: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ packages: 0, testimonials: 0, inquiries: 0, newInquiries: 0, media: 0 })
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/packages').then((r) => r.json()),
      fetch('/api/testimonials').then((r) => r.json()),
      fetch('/api/inquiries').then((r) => r.json()),
      fetch('/api/media').then((r) => r.json()),
    ])
      .then(([pkgs, testimonials, inquiries, media]) => {
        const inqs: Inquiry[] = Array.isArray(inquiries) ? inquiries : []
        setStats({
          packages: Array.isArray(pkgs) ? pkgs.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          inquiries: inqs.length,
          newInquiries: inqs.filter((i) => i.status === 'new').length,
          media: Array.isArray(media) ? media.length : 0,
        })
        setRecentInquiries(inqs.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Packages', value: stats.packages, icon: Package, href: '/admin/packages', color: 'bg-blue-50 text-blue-600' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'bg-purple-50 text-purple-600' },
    { label: 'Media Items', value: stats.media, icon: Image, href: '/admin/media', color: 'bg-green-50 text-green-600' },
    { label: 'New Enquiries', value: stats.newInquiries, icon: Mail, href: '/admin/inquiries', color: 'bg-amber-50 text-amber-600', highlight: stats.newInquiries > 0 },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-obsidian mb-1">Dashboard</h1>
        <p className="text-obsidian/40 text-sm">Welcome back — here&apos;s an overview of your site.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={card.href}
                className={`block bg-white p-6 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${card.highlight ? 'border-amber-300' : 'border-obsidian/8'}`}
              >
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 ${card.color}`}>
                  <Icon size={18} />
                </div>
                <p className="font-serif text-3xl text-obsidian font-semibold mb-1">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-obsidian/40 text-xs tracking-wide uppercase">{card.label}</p>
                {card.highlight && card.value > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-amber-600 text-xs">
                    <AlertCircle size={11} /> Needs attention
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent inquiries */}
        <div className="bg-white border border-obsidian/8 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-obsidian">Recent Enquiries</h2>
            <Link href="/admin/inquiries" className="text-gold text-xs flex items-center gap-1 hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-beige animate-pulse" />
              ))}
            </div>
          ) : recentInquiries.length === 0 ? (
            <p className="text-obsidian/30 text-sm text-center py-8">No enquiries yet</p>
          ) : (
            <div className="space-y-1">
              {recentInquiries.map((inq) => (
                <div key={inq._id} className="flex items-center gap-3 py-3 border-b border-obsidian/5 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${inq.status === 'new' ? 'bg-amber-500' : inq.status === 'replied' ? 'bg-green-500' : 'bg-obsidian/20'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-obsidian truncate">{inq.name}</p>
                    <p className="text-obsidian/40 text-xs truncate">{inq.packageName || inq.email}</p>
                  </div>
                  <span className={`text-[10px] tracking-wide uppercase px-2 py-1 rounded-sm ${inq.status === 'new' ? 'bg-amber-100 text-amber-700' : inq.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-obsidian/5 text-obsidian/40'}`}>
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white border border-obsidian/8 p-6">
          <h2 className="font-serif text-xl text-obsidian mb-6">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/packages/new', label: 'Add New Package', icon: Package, desc: 'Create a new tour package' },
              { href: '/admin/media', label: 'Upload Media', icon: Image, desc: 'Add Instagram posts or images' },
              { href: '/admin/testimonials', label: 'Add Testimonial', icon: MessageSquare, desc: 'Add a customer review' },
              { href: '/admin/settings', label: 'Update Settings', icon: TrendingUp, desc: 'Change contact details or logo' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 p-4 hover:bg-beige transition-colors group"
                >
                  <div className="w-9 h-9 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                    <Icon size={15} className="text-gold group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-obsidian">{item.label}</p>
                    <p className="text-obsidian/40 text-xs">{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-obsidian/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
