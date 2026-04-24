'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Testimonial } from '@/types'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setActiveIndex((i) => (i + 1) % testimonials.length)

  const active = testimonials[activeIndex]

  if (!testimonials.length || !active) return null

  return (
    <section ref={ref} className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold inline-block" />
            Client Stories
            <span className="w-8 h-px bg-gold inline-block" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian">
            What Our <span className="italic text-gold">Travellers</span> Say
          </h2>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-beige p-10 md:p-16">
            {/* Quote icon */}
            <Quote className="text-gold/20 absolute top-8 left-8" size={60} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: active.rating ?? 0 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>

                {/* Text */}
                <p className="font-serif text-xl md:text-2xl text-obsidian leading-relaxed italic mb-8">
                  &ldquo;{active.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={active.avatar}
                      alt={active.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-obsidian">{active.name}</p>
                    <p className="text-obsidian/50 text-sm">{active.location}</p>
                    <p className="text-gold text-xs tracking-wide mt-0.5">{active.package}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-8 h-1 bg-gold'
                      : 'w-2 h-1 bg-obsidian/20 hover:bg-obsidian/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 border border-obsidian/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 border border-obsidian/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
