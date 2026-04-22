'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Clock, Star, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Package } from '@/types'

interface FeaturedExperiencesProps {
  packages: Package[]
}

export default function FeaturedExperiences({ packages }: FeaturedExperiencesProps) {
  const featured = packages.filter((p) => p.featured).slice(0, 4)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold inline-block" />
              Curated Experiences
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
              Featured <span className="italic text-gold">Journeys</span>
            </h2>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-obsidian/60 hover:text-gold transition-colors duration-300 group"
          >
            View All Packages
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pkg, i) => (
            <FeaturedCard key={pkg.id} pkg={pkg} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedCard({ pkg, index, inView }: { pkg: Package; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/packages/${pkg.slug}`} className="group block">
        <div className="relative overflow-hidden aspect-[3/4] mb-5">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Tags */}
          <div className="absolute top-4 left-4 flex gap-2">
            {pkg.popular && (
              <span className="bg-gold text-white text-[10px] tracking-wider uppercase px-3 py-1 font-medium">
                Popular
              </span>
            )}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">{pkg.destination}</p>
            <h3 className="font-serif text-xl text-white font-semibold leading-snug">{pkg.title}</h3>
          </div>

          {/* Hover CTA */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          >
            <span className="text-white text-xs tracking-[0.3em] uppercase border border-white/60 px-6 py-3 hover:bg-white hover:text-obsidian transition-colors duration-300">
              View Details
            </span>
          </motion.div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-obsidian/50 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {pkg.duration.split('/')[0].trim()}
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="text-gold fill-gold" />
              {pkg.rating}
            </span>
          </div>
          <div className="text-right">
            {pkg.originalPrice && (
              <p className="text-obsidian/30 text-xs line-through">{formatPrice(pkg.originalPrice)}</p>
            )}
            <p className="font-serif text-obsidian text-lg font-semibold">
              {formatPrice(pkg.price)}
              <span className="text-obsidian/40 text-xs font-sans ml-1">pp</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
