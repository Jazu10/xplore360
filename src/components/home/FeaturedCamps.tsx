'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, ArrowRight, Tent } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Camp {
  _id?: string
  slug: string
  title: string
  subtitle?: string
  location: string
  duration?: string
  durationDays: number
  price: number
  currency: string
  heroImage?: string
  popular?: boolean
}

interface FeaturedCampsProps {
  camps: Camp[]
}

export default function FeaturedCamps({ camps }: FeaturedCampsProps) {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  if (!camps.length) return null

  const featured = camps.slice(0, 4)

  return (
    <section ref={sectionRef} className="py-28 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold inline-block" />
              Wild Escapes
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
              Featured <span className="italic text-gold">Camps</span>
            </h2>
          </div>
          <Link
            href="/camps"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-obsidian/60 hover:text-gold transition-colors duration-300 group"
          >
            View All Camps
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((camp, i) => (
            <CampCard key={camp.slug} camp={camp} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CampCard({ camp, index, inView }: { camp: Camp; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/camps/${camp.slug}`} className="group block">
        <div className="relative overflow-hidden aspect-[3/4] mb-5 bg-stone-200">
          {camp.heroImage ? (
            <Image
              src={camp.heroImage}
              alt={camp.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
              <Tent size={40} className="text-stone-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {camp.popular && (
            <div className="absolute top-4 left-4">
              <span className="bg-gold text-white text-[10px] tracking-wider uppercase px-3 py-1 font-medium">
                Popular
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1 flex items-center gap-1">
              <MapPin size={10} /> {camp.location}
            </p>
            <h3 className="font-serif text-xl text-white font-semibold leading-snug">{camp.title}</h3>
          </div>

          <motion.div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="text-white text-xs tracking-[0.3em] uppercase border border-white/60 px-6 py-3 hover:bg-white hover:text-obsidian transition-colors duration-300">
              View Details
            </span>
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-obsidian/50 text-sm">
            <Clock size={13} />
            {camp.duration || `${camp.durationDays} day${camp.durationDays !== 1 ? 's' : ''}`}
          </div>
          <p className="font-serif text-obsidian text-lg font-semibold">
            {formatPrice(camp.price)}
            <span className="text-obsidian/40 text-xs font-sans ml-1">pp</span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
