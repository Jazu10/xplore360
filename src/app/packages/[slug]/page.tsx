import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PackageDetailClient from './PackageDetailClient'
import { Package } from '@/types'
import packagesJson from '@/data/packages.json'

interface Props { params: { slug: string } }

async function getPackage(slug: string): Promise<Package | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/packages/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Not found')
    return res.json()
  } catch {
    return (packagesJson as Package[]).find((p) => p.slug === slug) ?? null
  }
}

export async function generateStaticParams() {
  return (packagesJson as Package[]).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackage(params.slug)
  if (!pkg) return {}
  return { title: pkg.title, description: pkg.overview?.slice(0, 160) }
}

export default async function PackagePage({ params }: Props) {
  const pkg = await getPackage(params.slug)
  if (!pkg) notFound()
  return <PackageDetailClient pkg={pkg} />
}
