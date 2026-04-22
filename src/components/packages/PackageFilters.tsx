'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

interface FiltersState {
  destination: string
  category: string
  maxPrice: number
  duration: string
}

interface PackageFiltersProps {
  filters: FiltersState
  onChange: (filters: FiltersState) => void
  destinations: string[]
  categories: string[]
}

const DURATION_OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Up to 5 nights', value: '1-5' },
  { label: '6–8 nights', value: '6-8' },
  { label: '9+ nights', value: '9+' },
]

export default function PackageFilters({
  filters,
  onChange,
  destinations,
  categories,
}: PackageFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const set = (key: keyof FiltersState, value: string | number) =>
    onChange({ ...filters, [key]: value })

  const reset = () =>
    onChange({ destination: '', category: '', maxPrice: 10000, duration: '' })

  const hasFilters =
    filters.destination || filters.category || filters.maxPrice < 10000 || filters.duration

  const FilterFields = () => (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-beige p-6">
      {/* Destination */}
      <div className="flex-1 min-w-0 w-full">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-obsidian/50 mb-2">
          Destination
        </label>
        <select
          value={filters.destination}
          onChange={(e) => set('destination', e.target.value)}
          className="w-full bg-white border-0 py-3 px-4 text-sm text-obsidian appearance-none focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="">All Destinations</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex-1 min-w-0 w-full">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-obsidian/50 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full bg-white border-0 py-3 px-4 text-sm text-obsidian appearance-none focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="flex-1 min-w-0 w-full">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-obsidian/50 mb-2">
          Duration
        </label>
        <select
          value={filters.duration}
          onChange={(e) => set('duration', e.target.value)}
          className="w-full bg-white border-0 py-3 px-4 text-sm text-obsidian appearance-none focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Max Price */}
      <div className="flex-1 min-w-0 w-full">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-obsidian/50 mb-2">
          Max Budget: £{filters.maxPrice.toLocaleString()}
        </label>
        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', Number(e.target.value))}
          className="w-full accent-gold"
        />
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className={`hidden md:block text-sm text-obsidian/40 hover:text-gold transition-colors py-3 whitespace-nowrap ${!hasFilters ? 'invisible' : ''}`}
      >
        Clear filters
      </button>
    </div>
  )

  return (
    <div className="mb-12">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm font-medium text-obsidian border border-obsidian/20 px-4 py-2.5"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && (
            <span className="w-5 h-5 bg-gold text-white rounded-full text-[10px] flex items-center justify-center">!</span>
          )}
        </button>
        {hasFilters && (
          <button onClick={reset} className="text-sm text-gold flex items-center gap-1">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block">
        <FilterFields />
      </div>

      {/* Mobile: animated */}
      <div className="md:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <FilterFields />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
