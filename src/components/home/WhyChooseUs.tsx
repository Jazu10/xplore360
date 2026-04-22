'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Headphones, MapPin, Star, Clock, Heart } from 'lucide-react'

const reasons = [
  {
    icon: Shield,
    title: 'ATOL Protected',
    description: 'Your holiday is fully protected. We are ATOL certified, giving you complete peace of mind when booking with us.',
  },
  {
    icon: Headphones,
    title: '24/7 UK Support',
    description: 'Our dedicated team is available around the clock throughout your journey — a real person, not a chatbot.',
  },
  {
    icon: MapPin,
    title: 'Expert Local Knowledge',
    description: 'Our destination specialists have personally visited every location we sell. Insider access guaranteed.',
  },
  {
    icon: Star,
    title: 'Handpicked Properties',
    description: 'Every hotel, villa, and resort is personally inspected and selected for quality, location, and character.',
  },
  {
    icon: Clock,
    title: 'Seamless Planning',
    description: 'From visa assistance to private transfers — we handle every detail so you can focus entirely on enjoying.',
  },
  {
    icon: Heart,
    title: 'Tailored to You',
    description: 'No two holidays are the same. Every itinerary is crafted around your preferences, pace, and passions.',
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
            Why Raniya Travel
            <span className="w-8 h-px bg-gold inline-block" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
            The Raniya <span className="italic text-gold">Difference</span>
          </h2>
          <p className="text-obsidian/50 text-lg font-light mt-5 max-w-xl mx-auto">
            We don&apos;t just book holidays — we craft experiences that become lifelong memories.
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
