'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, Calendar, CheckCircle, XCircle, ChevronDown, Phone, MessageCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ReviewSection from '@/components/reviews/ReviewSection'
import { useState } from 'react'
import { buildWhatsAppUrl } from '@/lib/utils'
import { useSettings } from '@/hooks/useSettings'

interface ItineraryDay { day: number; title: string; description: string; meals?: string; accommodation?: string }

interface Camp {
  slug: string; title: string; subtitle?: string; location: string
  duration?: string; durationDays: number; price: number; originalPrice?: number; currency: string
  category: string; heroImage?: string; gallery?: string[]; overview?: string
  highlights?: string[]; included?: string[]; excluded?: string[]
  capacity?: number; season?: string; itinerary?: ItineraryDay[]
  featured?: boolean; popular?: boolean; bookingFormUrl?: string
}

export default function CampDetailClient({ camp }: { camp: Camp }) {
  const { whatsapp, phone } = useSettings()
  const [openDay, setOpenDay] = useState<number | null>(0)
  const whatsappMsg = `Hi, I'm interested in the "${camp.title}" camp. Could you provide more details?`

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {camp.heroImage ? (
          <Image src={camp.heroImage} alt={camp.title} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="w-full h-full bg-obsidian" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-0 right-0 px-6 lg:px-8 max-w-7xl mx-auto">
          <span className="text-gold text-xs tracking-[0.35em] uppercase mb-3 block">{camp.category}</span>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-semibold mb-3">{camp.title}</h1>
          {camp.subtitle && <p className="text-white/70 text-lg max-w-2xl">{camp.subtitle}</p>}
          <div className="flex flex-wrap gap-5 mt-5 text-white/60 text-sm">
            <span className="flex items-center gap-2"><MapPin size={14} />{camp.location}</span>
            {camp.duration && <span className="flex items-center gap-2"><Clock size={14} />{camp.duration}</span>}
            {camp.capacity && <span className="flex items-center gap-2"><Users size={14} />Up to {camp.capacity} people</span>}
            {camp.season && <span className="flex items-center gap-2"><Calendar size={14} />{camp.season}</span>}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            {camp.overview && (
              <AnimatedSection>
                <h2 className="font-serif text-3xl text-obsidian mb-5">About This Experience</h2>
                <p className="text-obsidian/60 leading-relaxed text-lg">{camp.overview}</p>
              </AnimatedSection>
            )}

            {/* Highlights */}
            {camp.highlights && camp.highlights.length > 0 && (
              <AnimatedSection>
                <h2 className="font-serif text-2xl text-obsidian mb-5">Highlights</h2>
                <ul className="space-y-3">
                  {camp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-gold mt-1 shrink-0" />
                      <span className="text-obsidian/70">{h}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            )}

            {/* Included / Excluded */}
            {((camp.included?.length ?? 0) > 0 || (camp.excluded?.length ?? 0) > 0) && (
              <AnimatedSection>
                <h2 className="font-serif text-2xl text-obsidian mb-5">What&apos;s Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {camp.included && camp.included.length > 0 && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-3">Included</p>
                      <ul className="space-y-2">
                        {camp.included.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-obsidian/70">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {camp.excluded && camp.excluded.length > 0 && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-obsidian/40 mb-3">Not Included</p>
                      <ul className="space-y-2">
                        {camp.excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-obsidian/70">
                            <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Itinerary */}
            {camp.itinerary && camp.itinerary.length > 0 && (
              <AnimatedSection>
                <h2 className="font-serif text-2xl text-obsidian mb-5">Itinerary</h2>
                <div className="space-y-2">
                  {camp.itinerary.map((day, i) => (
                    <div key={i} className="border border-obsidian/10">
                      <button className="w-full flex items-center justify-between p-5 text-left hover:bg-beige/50 transition-colors"
                        onClick={() => setOpenDay(openDay === i ? null : i)}>
                        <span className="font-medium text-obsidian">Day {day.day}: {day.title}</span>
                        <ChevronDown size={16} className={`text-obsidian/40 transition-transform ${openDay === i ? 'rotate-180' : ''}`} />
                      </button>
                      {openDay === i && (
                        <div className="px-5 pb-5 space-y-3">
                          <p className="text-obsidian/60 text-sm leading-relaxed">{day.description}</p>
                          <div className="flex gap-6 text-xs text-obsidian/40">
                            {day.meals && <span>Meals: {day.meals}</span>}
                            {day.accommodation && <span>Stay: {day.accommodation}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-obsidian/10 p-8 space-y-6">
              <div>
                <span className="text-xs tracking-widest uppercase text-obsidian/40">From</span>
                <div className="flex items-end gap-2 mt-1">
                  <p className="font-serif text-4xl text-obsidian">{camp.currency}{camp.price.toLocaleString()}</p>
                  {camp.originalPrice && (
                    <p className="text-obsidian/30 line-through text-lg mb-1">{camp.currency}{camp.originalPrice.toLocaleString()}</p>
                  )}
                </div>
                <p className="text-obsidian/40 text-xs mt-1">per person</p>
              </div>

              <div className="space-y-3 pt-2">
                {camp.bookingFormUrl && (
                  <a href={camp.bookingFormUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gold text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-gold/90 transition-colors">
                    Book Now
                  </a>
                )}
                <a href={buildWhatsAppUrl(whatsapp, whatsappMsg)} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 text-sm font-medium tracking-wide hover:bg-[#1fb855] transition-colors">
                  <MessageCircle size={16} /> Book via WhatsApp
                </a>
                <a href={`tel:${phone}`}
                  className="w-full flex items-center justify-center gap-2 border border-obsidian/20 text-obsidian py-4 text-sm font-medium tracking-wide hover:border-gold hover:text-gold transition-colors">
                  <Phone size={16} /> Call to Enquire
                </a>
              </div>

              {(camp.capacity || camp.season) && (
                <div className="pt-4 border-t border-obsidian/8 space-y-3 text-sm">
                  {camp.capacity && (
                    <div className="flex justify-between">
                      <span className="text-obsidian/40">Group size</span>
                      <span className="text-obsidian font-medium">Up to {camp.capacity}</span>
                    </div>
                  )}
                  {camp.season && (
                    <div className="flex justify-between">
                      <span className="text-obsidian/40">Season</span>
                      <span className="text-obsidian font-medium">{camp.season}</span>
                    </div>
                  )}
                  {camp.duration && (
                    <div className="flex justify-between">
                      <span className="text-obsidian/40">Duration</span>
                      <span className="text-obsidian font-medium">{camp.duration}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection targetSlug={camp.slug} targetType="camp" />
      </div>
    </div>
  )
}
