'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'
import { siteConfig } from '@/lib/site-config'

interface SiteSettings {
  siteName: string
  logoUrl?: string
  whatsapp: string
  phone: string
  email: string
  address: string
  socialMedia: { instagram: string; facebook: string }
}

const DEFAULT: SiteSettings = {
  siteName: siteConfig.siteName,
  logoUrl: siteConfig.logoUrl,
  whatsapp: siteConfig.whatsapp,
  phone: siteConfig.phone,
  email: siteConfig.email,
  address: siteConfig.address,
  socialMedia: siteConfig.socialMedia,
}

export default function Footer() {
  const year = new Date().getFullYear()
  const [cfg, setCfg] = useState<SiteSettings>(DEFAULT)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setCfg(d) })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-obsidian text-white">
      <div className="border-t border-gold/30 bg-obsidian-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {cfg.logoUrl ? (
                  <Image
                    src={cfg.logoUrl}
                    alt={cfg.siteName}
                    height={44}
                    width={180}
                    className="h-11 w-auto object-contain brightness-0 invert"
                  />
                ) : (
                  <>
                    <span className="font-serif text-3xl text-white">{cfg.siteName}</span>
                    <span className="block text-[9px] tracking-[0.4em] text-gold uppercase mt-1">
                      Premium Travel
                    </span>
                  </>
                )}
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                We craft extraordinary journeys for discerning travellers. Every detail curated,
                every moment memorable. Based in the United Kingdom.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href={cfg.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href={cfg.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href={buildWhatsAppUrl(cfg.whatsapp, "Hello! I'd like to enquire about a travel package.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">Explore</h3>
              <ul className="space-y-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/packages', label: 'All Packages' },
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-white animated-underline transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`tel:${cfg.phone}`}
                    className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors"
                  >
                    <Phone size={14} className="text-gold shrink-0" />
                    {cfg.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${cfg.email}`}
                    className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors"
                  >
                    <Mail size={14} className="text-gold shrink-0" />
                    {cfg.email}
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-3 text-white/50 text-sm">
                    <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                    {cfg.address}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {year} {cfg.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="text-white/20 text-xs hover:text-white/40 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
