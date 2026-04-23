import configJson from '@/data/config.json'

export const SITE_NAME = configJson.siteName
export const SITE_TAGLINE = configJson.tagline
export const DEFAULT_LOGO_URL = configJson.logoUrl
export const SITE_SLUG = configJson.siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
export const siteConfig = configJson
