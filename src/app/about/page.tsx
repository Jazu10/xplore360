import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Raniya Travel — a UK-based luxury travel agency crafting extraordinary journeys for discerning travellers.',
}

export default function AboutPage() {
  return <AboutClient />
}
