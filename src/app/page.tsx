import Hero from '@/components/home/Hero'
import FeaturedExperiences from '@/components/home/FeaturedExperiences'
import Stats from '@/components/home/Stats'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'
import InstagramFeed from '@/components/home/InstagramFeed'
import StickyBooking from '@/components/ui/StickyBooking'
import { getPackagesData, getTestimonialsData } from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const [packages, testimonials] = await Promise.all([
    getPackagesData(true),
    getTestimonialsData(),
  ])

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
