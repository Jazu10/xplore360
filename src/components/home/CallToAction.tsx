'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import BookingCTAs from '@/components/ui/BookingCTAs'

export default function CallToAction() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section ref={ref} className="relative py-36 overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&q=85"
          alt="Luxury travel"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-obsidian/70" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-gold inline-block" />
            Start Your Journey
            <span className="w-8 h-px bg-gold inline-block" />
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white font-semibold leading-tight mb-6">
            Your Dream Holiday <br />
            <span className="italic text-gold">Awaits You</span>
          </h2>
          <p className="text-white/60 text-lg font-light max-w-xl mx-auto mb-12">
            Speak to one of our travel specialists today. We&apos;ll craft the perfect journey — completely tailored to you.
          </p>

          <div className="flex justify-center">
            <BookingCTAs size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
