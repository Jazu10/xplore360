import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PackageDetailClient from './PackageDetailClient'
import { Package } from '@/types'
import packagesJson from '@/data/packages.json'
import { getPackageBySlug } from '@/lib/data'

export const revalidate = 0

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return (packagesJson as unknown as Package[]).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlug(params.slug)
  if (!pkg) return {}
  return { title: pkg.title, description: pkg.overview?.slice(0, 160) }
}

export default async function PackagePage({ params }: Props) {
  const pkg = await getPackageBySlug(params.slug)
  if (!pkg) notFound()
  return <PackageDetailClient pkg={pkg} />
}
