import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import campsJson from '@/data/camps.json'
import CampDetailClient from './CampDetailClient'
import { isDBConfigured, connectDB } from '@/lib/db'

export const revalidate = 60

interface Props { params: { slug: string } }

async function getCamp(slug: string) {
  if (isDBConfigured()) {
    try {
      await connectDB()
      const CampModel = (await import('@/models/Camp')).default
      const doc = await CampModel.findOne({ slug }).lean()
      if (doc) return doc
    } catch {}
  }
  return campsJson.find((c) => c.slug === slug) ?? null
}

export async function generateStaticParams() {
  return campsJson.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const camp = await getCamp(params.slug)
  if (!camp) return {}
  return { title: (camp as { title: string }).title, description: (camp as { overview?: string }).overview?.slice(0, 160) }
}

export default async function CampPage({ params }: Props) {
  const camp = await getCamp(params.slug)
  if (!camp) notFound()
  return <CampDetailClient camp={camp as never} />
}
