'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/site-config'

export interface SiteSettings {
  siteName: string
  whatsapp: string
  phone: string
  email: string
  address: string
  logoUrl: string
  socialMedia: { instagram: string; facebook: string }
}

const DEFAULT: SiteSettings = {
  siteName: siteConfig.siteName,
  whatsapp: siteConfig.whatsapp,
  phone: siteConfig.phone,
  email: siteConfig.email,
  address: siteConfig.address,
  logoUrl: siteConfig.logoUrl,
  socialMedia: { ...siteConfig.socialMedia },
}

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error)
          setSettings({ ...DEFAULT, ...d, socialMedia: { ...DEFAULT.socialMedia, ...d.socialMedia } })
      })
      .catch(() => {})
  }, [])

  return settings
}
