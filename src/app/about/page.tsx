import type { Metadata } from 'next'
import AboutClient from './AboutClient'
import { SITE_NAME } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME} — a UK-based luxury travel agency crafting extraordinary journeys for discerning travellers.`,
}

export default function AboutPage() {
  return <AboutClient />
}
