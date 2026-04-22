import Hero from '@/components/home/Hero'
import FeaturedExperiences from '@/components/home/FeaturedExperiences'
import Stats from '@/components/home/Stats'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'
import InstagramFeed from '@/components/home/InstagramFeed'
import StickyBooking from '@/components/ui/StickyBooking'
import { Package, Testimonial } from '@/types'

async function getPackages(): Promise<Package[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/packages?featured=true`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Failed')
    return res.json()
  } catch {
    const data = await import('@/data/packages.json')
    return (data.default as Package[]).filter((p) => p.featured)
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/testimonials`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Failed')
    return res.json()
  } catch {
    const data = await import('@/data/testimonials.json')
    return data.default as Testimonial[]
  }
}

export default async function HomePage() {
  const [packages, testimonials] = await Promise.all([getPackages(), getTestimonials()])

  return (
    <div className="page-wrapper">
      <Hero />
      <FeaturedExperiences packages={packages} />
      <Stats />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <InstagramFeed />
      <CallToAction />
      <StickyBooking />
    </div>
  )
}
