import Hero from '@/components/home/Hero'
import FeaturedExperiences from '@/components/home/FeaturedExperiences'
import FeaturedCamps from '@/components/home/FeaturedCamps'
import Stats from '@/components/home/Stats'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'
import InstagramFeed from '@/components/home/InstagramFeed'
import StickyBooking from '@/components/ui/StickyBooking'
import { getPackagesData, getTestimonialsData, getCampsData } from '@/lib/data'

export const revalidate = 0

export default async function HomePage() {
  const [packages, testimonials, camps] = await Promise.all([
    getPackagesData(true),
    getTestimonialsData(),
    getCampsData(true),
  ])

  return (
    <div className="page-wrapper">
      <Hero />
      {packages.length > 0 && <FeaturedExperiences packages={packages} />}
      {camps.length > 0 && <FeaturedCamps camps={camps as Parameters<typeof FeaturedCamps>[0]['camps']} />}
      <Stats />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <InstagramFeed />
      <CallToAction />
      <StickyBooking />
    </div>
  )
}
