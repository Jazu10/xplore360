'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Compass, Sparkles, HeartHandshake } from 'lucide-react'
import { SITE_NAME } from '@/lib/site-config'

const pillars = [
  {
    icon: Compass,
    heading: 'Curated Travel Experiences',
    body: 'Every package is personally researched and designed — not pulled from a catalogue. We visit the destinations we sell, so our recommendations are genuine.',
  },
  {
    icon: Sparkles,
    heading: 'A New & Growing Vision',
    body: `${SITE_NAME} is a young, passionate travel brand built on one belief: extraordinary journeys should be accessible to every discerning traveller.`,
  },
  {
    icon: HeartHandshake,
    heading: 'Personalised Trip Planning',
    body: 'No two trips are ever the same. Tell us your dream and we\'ll craft an itinerary around your dates, budget, and the experiences that matter most to you.',
  },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.35em] uppercase flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold inline-block" />
            The {SITE_NAME} Promise
            <span className="w-8 h-px bg-gold inline-block" />
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-white/10">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.heading}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group text-center md:px-12 py-8 md:py-0 relative"
              >
                {/* Animated gold line on hover */}
                <div className="w-0 group-hover:w-full h-px bg-gold/40 absolute top-0 left-0 transition-all duration-700" />

                <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                  <Icon size={22} className="text-gold group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className="font-serif text-xl text-white mb-4 leading-snug">
                  {pillar.heading}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                  {pillar.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
