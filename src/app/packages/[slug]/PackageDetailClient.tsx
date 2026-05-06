'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Star, Clock, MapPin, Check, X, ChevronDown, ChevronLeft,
  ChevronRight, Instagram, ArrowLeft,
} from 'lucide-react'
import BookingCTAs from '@/components/ui/BookingCTAs'
import StickyBooking from '@/components/ui/StickyBooking'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ReviewSection from '@/components/reviews/ReviewSection'
import { formatPrice } from '@/lib/utils'
import { Package } from '@/types'

interface PackageDetailClientProps {
  pkg: Package
}

export default function PackageDetailClient({ pkg }: PackageDetailClientProps) {
  const [activeDay, setActiveDay] = useState<number | null>(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [liveRating, setLiveRating] = useState(pkg.rating)
  const [liveReviewCount, setLiveReviewCount] = useState(pkg.reviewCount)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const allImages = [pkg.heroImage, ...pkg.gallery]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 lg:px-16 max-w-7xl mx-auto"
        >
          <Link
            href="/packages"
            className="absolute top-8 left-6 lg:left-16 flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            All Packages
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gold text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                <MapPin size={12} />
                {pkg.destination}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-white/60 text-[10px] tracking-widest uppercase">{pkg.category}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-white font-semibold leading-tight mb-4">
              {pkg.title}
            </h1>
            <p className="text-white/70 text-lg font-light max-w-xl">{pkg.subtitle}</p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Clock size={14} className="text-gold" />
                {pkg.duration}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(liveRating) ? 'fill-gold text-gold' : 'text-white/20'}
                  />
                ))}
                <span className="text-white/60 text-sm ml-1">
                  {liveRating > 0 ? liveRating.toFixed(1) : '—'} ({liveReviewCount} reviews)
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <AnimatedSection>
              <h2 className="font-serif text-3xl text-obsidian mb-6">Overview</h2>
              <p className="text-obsidian/60 text-lg leading-relaxed">{pkg.overview}</p>

              {pkg.highlights.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-beige p-4">
                      <Check size={16} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-sm text-obsidian/70">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* Gallery */}
            <AnimatedSection delay={0.1}>
              <h2 className="font-serif text-3xl text-obsidian mb-6">Gallery</h2>
              <div className="relative overflow-hidden aspect-video mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={galleryIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={allImages[galleryIndex]}
                      alt={`${pkg.title} gallery ${galleryIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                <button
                  onClick={() => setGalleryIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setGalleryIndex((i) => (i + 1) % allImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1">
                  {galleryIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`relative shrink-0 w-20 h-14 overflow-hidden transition-all duration-300 ${
                      i === galleryIndex ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Itinerary */}
            <AnimatedSection delay={0.1}>
              <h2 className="font-serif text-3xl text-obsidian mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-3">
                {pkg.itinerary.map((day, i) => (
                  <div key={i} className="border border-obsidian/10">
                    <button
                      onClick={() => setActiveDay(activeDay === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-beige transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-gold text-white flex items-center justify-center text-sm font-medium shrink-0">
                          {day.day}
                        </span>
                        <div>
                          <p className="font-medium text-obsidian">{day.title}</p>
                          {day.meals && (
                            <p className="text-obsidian/40 text-xs mt-0.5">{day.meals}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-obsidian/40 transition-transform duration-300 ${
                          activeDay === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDay === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 ml-14">
                            <p className="text-obsidian/60 text-sm leading-relaxed">{day.description}</p>
                            {day.accommodation && (
                              <p className="text-gold text-xs mt-3 tracking-wide">
                                🏨 {day.accommodation}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Included / Excluded */}
            <AnimatedSection delay={0.1}>
              <h2 className="font-serif text-3xl text-obsidian mb-6">What&apos;s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-obsidian mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 text-green-600 flex items-center justify-center rounded-sm">
                      <Check size={12} />
                    </span>
                    Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-obsidian/70">
                        <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-obsidian mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-red-50 text-red-500 flex items-center justify-center rounded-sm">
                      <X size={12} />
                    </span>
                    Not Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.excluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-obsidian/70">
                        <X size={14} className="text-red-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Instagram Videos */}
            {pkg.instagramVideos.length > 0 && (
              <AnimatedSection delay={0.1}>
                <h2 className="font-serif text-3xl text-obsidian mb-6">
                  <span className="flex items-center gap-3">
                    <Instagram size={28} className="text-pink-500" />
                    See It on Instagram
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.instagramVideos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 hover:opacity-90 transition-opacity"
                    >
                      <Instagram size={20} />
                      <span className="text-sm font-medium">Watch Reel {i + 1}</span>
                    </a>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Right column — Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <AnimatedSection direction="left">
                <div className="border border-obsidian/10 p-8">
                  <div className="text-center mb-8">
                    {pkg.originalPrice && (
                      <p className="text-obsidian/30 text-sm line-through mb-1">
                        Was {formatPrice(pkg.originalPrice)}
                      </p>
                    )}
                    <p className="font-serif text-4xl text-obsidian font-semibold">
                      {formatPrice(pkg.price)}
                    </p>
                    <p className="text-obsidian/40 text-sm mt-1">per person</p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < Math.floor(liveRating) ? 'fill-gold text-gold' : 'text-obsidian/20'}
                          />
                        ))}
                      </div>
                      <span className="text-obsidian/50 text-xs">{liveReviewCount} reviews</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 text-sm">
                    <div className="flex items-center justify-between py-3 border-b border-obsidian/8">
                      <span className="text-obsidian/50">Destination</span>
                      <span className="font-medium text-obsidian">{pkg.destination}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-obsidian/8">
                      <span className="text-obsidian/50">Duration</span>
                      <span className="font-medium text-obsidian">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-obsidian/50">Category</span>
                      <span className="font-medium text-obsidian">{pkg.category}</span>
                    </div>
                  </div>

                  <div className="bg-beige p-4 mb-6 text-center">
                    <p className="text-obsidian/60 text-xs leading-relaxed">
                      No payment online — our specialist will contact you within 48 hours to confirm availability and details.
                    </p>
                  </div>

                  {pkg.bookingFormUrl && (
                    <a
                      href={pkg.bookingFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gold text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-gold/90 transition-colors mb-3"
                    >
                      Book Now
                    </a>
                  )}
                  <BookingCTAs packageName={pkg.title} layout="vertical" size="md" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {pkg.tags.map((tag) => (
                    <span key={tag} className="text-xs text-obsidian/50 border border-obsidian/10 px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ReviewSection
          targetSlug={pkg.slug}
          targetType="package"
          onStatsChange={(r, c) => { setLiveRating(r); setLiveReviewCount(c) }}
        />
      </div>

      <StickyBooking packageName={pkg.title} />
    </div>
  )
}
