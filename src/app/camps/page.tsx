'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, ChevronRight, Tent, Loader2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import campsJson from '@/data/camps.json'

interface Camp {
  _id?: string; slug: string; title: string; subtitle?: string; location: string
  duration?: string; durationDays: number; price: number; currency: string
  category: string; heroImage?: string; overview?: string
  capacity?: number; season?: string; featured?: boolean; popular?: boolean
}

export default function CampsPage() {
  const [camps, setCamps] = useState<Camp[]>(campsJson as Camp[])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetch('/api/camps')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d) && d.length > 0) setCamps(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() =>
    ['All', ...Array.from(new Set(camps.map((c) => c.category))).sort()],
    [camps]
  )

  const filtered = useMemo(() =>
    category === 'All' ? camps : camps.filter((c) => c.category === category),
    [camps, category]
  )

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80"
          alt="Camps" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-obsidian/65" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <span className="text-gold text-xs tracking-[0.35em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-gold" /> Outdoor Experiences <span className="w-8 h-px bg-gold" />
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">Camps & Retreats</h1>
          <p className="text-white/60 mt-4 max-w-xl">Immersive outdoor experiences — from wild camping to luxury glamping</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all duration-200 ${category === cat ? 'bg-obsidian text-white border-obsidian' : 'border-obsidian/20 text-obsidian/60 hover:border-obsidian/50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-obsidian/30">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((camp, i) => (
              <AnimatedSection key={camp._id || camp.slug} delay={i * 0.07}>
                <Link href={`/camps/${camp.slug}`} className="group block">
                  <div className="relative overflow-hidden aspect-[4/3] mb-5">
                    {camp.heroImage ? (
                      <Image src={camp.heroImage} alt={camp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-beige flex items-center justify-center">
                        <Tent size={40} className="text-obsidian/20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {camp.popular && <span className="bg-gold text-white text-[10px] tracking-widest uppercase px-2 py-1">Popular</span>}
                      <span className="bg-obsidian/70 text-white text-[10px] tracking-widest uppercase px-2 py-1">{camp.category}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-obsidian mb-1 group-hover:text-gold transition-colors">{camp.title}</h3>
                    {camp.subtitle && <p className="text-obsidian/50 text-sm mb-3">{camp.subtitle}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-obsidian/40 mb-4">
                      <span className="flex items-center gap-1"><MapPin size={11} />{camp.location}</span>
                      {camp.duration && <span className="flex items-center gap-1"><Clock size={11} />{camp.duration}</span>}
                      {camp.capacity && <span className="flex items-center gap-1"><Users size={11} />Up to {camp.capacity} people</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-obsidian/40 uppercase tracking-widest">From</span>
                        <p className="font-serif text-2xl text-obsidian">{camp.currency}{camp.price.toLocaleString()}</p>
                      </div>
                      <span className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                        View <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-obsidian/30 py-20">No camps found in this category.</p>
        )}
      </div>
    </div>
  )
}
