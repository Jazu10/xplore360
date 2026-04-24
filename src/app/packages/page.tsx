'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import PackageCard from '@/components/packages/PackageCard'
import PackageFilters from '@/components/packages/PackageFilters'
import StickyBooking from '@/components/ui/StickyBooking'
import { Package } from '@/types'
import { Loader2 } from 'lucide-react'

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    destination: '', category: '', maxPrice: 10000, duration: '',
  })

  useEffect(() => {
    fetch('/api/packages', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPackages(d) })
      .catch(() => import('@/data/packages.json').then((m) => setPackages(m.default as Package[])))
      .finally(() => setLoading(false))
  }, [])

  const allDestinations = useMemo(
    () => Array.from(new Set(packages.map((p) => p.destination))).sort(),
    [packages]
  )
  const allCategories = useMemo(
    () => Array.from(new Set(packages.map((p) => p.category))).sort(),
    [packages]
  )

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      if (filters.destination && pkg.destination !== filters.destination) return false
      if (filters.category && pkg.category !== filters.category) return false
      if (pkg.price > filters.maxPrice) return false
      if (filters.duration) {
        if (filters.duration === '1-5' && pkg.durationDays > 5) return false
        if (filters.duration === '6-8' && (pkg.durationDays < 6 || pkg.durationDays > 8)) return false
        if (filters.duration === '9+' && pkg.durationDays < 9) return false
      }
      return true
    })
  }, [packages, filters])

  return (
    <div className="pt-20">
      <div className="bg-obsidian py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold inline-block" /> Curated Collection
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">
              All <span className="italic text-gold">Packages</span>
            </h1>
            <p className="text-white/50 text-lg font-light mt-4 max-w-lg">
              {packages.length} curated journeys to inspire your next adventure
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <PackageFilters
          filters={filters}
          onChange={setFilters}
          destinations={allDestinations}
          categories={allCategories}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-gold animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="font-serif text-2xl text-obsidian/40">No packages match your filters</p>
            <button onClick={() => setFilters({ destination: '', category: '', maxPrice: 10000, duration: '' })}
              className="mt-6 text-gold text-sm underline underline-offset-4">
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <>
            <p className="text-obsidian/40 text-sm mb-8">
              {filtered.length} package{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((pkg, i) => <PackageCard key={pkg.id || (pkg as { _id?: string })._id} pkg={pkg} index={i} />)}
            </div>
          </>
        )}
      </div>

      <StickyBooking />
    </div>
  )
}
