'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, Star, MapPin, ArrowUpRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Package } from '@/types'

interface PackageCardProps {
  pkg: Package
  index?: number
}

export default function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/packages/${pkg.slug}`} className="group block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] mb-5">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {pkg.popular && (
              <span className="bg-gold text-white text-[10px] tracking-wider uppercase px-3 py-1 font-medium">
                Popular
              </span>
            )}
            {pkg.originalPrice && (
              <span className="bg-red-500 text-white text-[10px] tracking-wider uppercase px-3 py-1 font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-gold">
            <ArrowUpRight size={16} className="text-white" />
          </div>

          {/* Category */}
          <div className="absolute bottom-4 left-4">
            <span className="text-white/70 text-[10px] tracking-[0.25em] uppercase">{pkg.category}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-xl text-obsidian group-hover:text-gold transition-colors duration-300 leading-snug">
              {pkg.title}
            </h3>
            <div className="text-right shrink-0">
              {pkg.originalPrice && (
                <p className="text-obsidian/30 text-xs line-through leading-tight">
                  {formatPrice(pkg.originalPrice)}
                </p>
              )}
              <p className="font-serif text-xl text-obsidian font-semibold">
                {formatPrice(pkg.price)}
              </p>
              <p className="text-obsidian/40 text-[10px]">per person</p>
            </div>
          </div>

          <p className="text-obsidian/50 text-sm mb-4 leading-relaxed line-clamp-2">{pkg.subtitle}</p>

          <div className="flex items-center gap-4 text-sm text-obsidian/50 pt-4 border-t border-obsidian/8">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-gold" />
              {pkg.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {pkg.durationDays}N
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Star size={13} className="fill-gold text-gold" />
              {pkg.rating}
              <span className="text-obsidian/30">({pkg.reviewCount})</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
