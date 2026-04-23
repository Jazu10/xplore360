'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Compass, Sparkles, Map, Heart, Star } from 'lucide-react'
import { SITE_NAME } from '@/lib/site-config'

const reasons = [
  {
    icon: Users,
    title: 'Travel With Strangers',
    description: 'Our unique concept puts you in carefully curated groups of like-minded explorers. Leave alone, come back with friends.',
  },
  {
    icon: Compass,
    title: 'Hassle-Free Planning',
    description: 'We handle everything — flights, hotels, activities, and transfers. You just show up and enjoy.',
  },
  {
    icon: Sparkles,
    title: 'Story-Driven Experiences',
    description: 'We don\'t just plan trips. We create moments that stay with you long after you\'ve returned home.',
  },
  {
    icon: Heart,
    title: 'Built on Community',
    description: 'Strong focus on connection and belonging. Every trip is designed to spark real friendships along the way.',
  },
  {
    icon: Map,
    title: 'Curated Social Groups',
    description: 'We match travellers by vibe and interests — solo travellers, young professionals, and curious explorers.',
  },
  {
    icon: Star,
    title: 'Memorable by Design',
    description: 'Every destination and itinerary is chosen to be genuinely exciting, not just ticked off a bucket list.',
  },
]

export default function WhyChooseUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-28 bg-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold inline-block" />
            Why {SITE_NAME}
            <span className="w-8 h-px bg-gold inline-block" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
            The {SITE_NAME} <span className="italic text-gold">Difference</span>
          </h2>
          <p className="text-obsidian/50 text-lg font-light mt-5 max-w-xl mx-auto">
            We don&apos;t just plan trips — we create moments that stay with you.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group bg-white p-8 hover:shadow-xl transition-shadow duration-500"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-gold/30 mb-6 group-hover:bg-gold group-hover:border-gold transition-all duration-400">
                  <Icon size={20} className="text-gold group-hover:text-white transition-colors duration-400" />
                </div>
                <h3 className="font-serif text-xl text-obsidian mb-3">{reason.title}</h3>
                <p className="text-obsidian/50 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
