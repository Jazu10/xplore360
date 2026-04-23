import { Package, Testimonial } from '@/types'
import { isDBConfigured, connectDB } from '@/lib/db'
import packagesJson from '@/data/packages.json'
import testimonialsJson from '@/data/testimonials.json'
import campsJson from '@/data/camps.json'

export async function getPackagesData(featuredOnly = false): Promise<Package[]> {
  if (isDBConfigured()) {
    try {
      await connectDB()
      const PackageModel = (await import('@/models/Package')).default
      const query = featuredOnly ? { featured: true, published: true } : { published: true }
      const docs = await PackageModel.find(query).lean()
      return docs as unknown as Package[]
    } catch {}
  }
  const all = packagesJson as unknown as Package[]
  return featuredOnly ? all.filter((p) => p.featured) : all
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  if (isDBConfigured()) {
    try {
      await connectDB()
      const PackageModel = (await import('@/models/Package')).default
      const doc = await PackageModel.findOne({ slug }).lean()
      if (doc) return doc as unknown as Package
    } catch {}
  }
  return (packagesJson as unknown as Package[]).find((p) => p.slug === slug) ?? null
}

export async function getCampsData(featuredOnly = false): Promise<unknown[]> {
  if (isDBConfigured()) {
    try {
      await connectDB()
      const CampModel = (await import('@/models/Camp')).default
      const query = featuredOnly ? { featured: true, published: true } : { published: true }
      const docs = await CampModel.find(query).lean()
      return docs as unknown[]
    } catch {}
  }
  const all = campsJson as unknown[]
  return featuredOnly ? (all as { featured?: boolean }[]).filter((c) => c.featured) : all
}

export async function getTestimonialsData(): Promise<Testimonial[]> {
  if (isDBConfigured()) {
    try {
      await connectDB()
      const TestimonialModel = (await import('@/models/Testimonial')).default
      const docs = await TestimonialModel.find({ published: true }).lean()
      return docs as unknown as Testimonial[]
    } catch {}
  }
  return testimonialsJson as unknown as Testimonial[]
}
