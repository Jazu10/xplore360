'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, Image, MessageSquare, Mail,
  Settings, LogOut, Globe, ChevronRight, Users, Tent, Star, UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/site-config'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/camps', label: 'Camps', icon: Tent },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/users', label: 'Members', icon: UserCheck },
  { href: '/admin/admins', label: 'Admins', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-obsidian border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex flex-col">
          <span className="font-serif text-xl text-white tracking-tight">{SITE_NAME}</span>
          <span className="text-[9px] tracking-[0.35em] text-gold uppercase mt-0.5">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group relative',
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              )}
            >
              {active && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={16} className="shrink-0" />
              <span className="font-medium tracking-wide">{item.label}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Globe size={15} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  )
}
