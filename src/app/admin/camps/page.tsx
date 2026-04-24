'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Loader2, Search, Tent } from 'lucide-react'
import toast from 'react-hot-toast'

interface Camp {
  _id: string; slug: string; title: string; location: string
  price: number; currency: string; heroImage?: string
  featured: boolean; popular: boolean; published: boolean
  category: string; durationDays: number; rating: number; reviewCount: number
}

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/camps', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCamps(d) })
      .catch(() => toast.error('Failed to load camps'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const deleteCamp = async (camp: Camp) => {
    if (!confirm(`Delete "${camp.title}"? This cannot be undone.`)) return
    setDeleting(camp._id)
    try {
      const res = await fetch(`/api/camps/${camp._id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Camp deleted')
      setCamps((c) => c.filter((x) => x._id !== camp._id))
    } catch {
      toast.error('Failed to delete camp')
    } finally {
      setDeleting(null)
    }
  }

  const togglePublished = async (camp: Camp) => {
    try {
      const res = await fetch(`/api/camps/${camp._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !camp.published }),
      })
      if (!res.ok) throw new Error()
      setCamps((prev) => prev.map((c) => c._id === camp._id ? { ...c, published: !c.published } : c))
      toast.success(camp.published ? 'Camp unpublished' : 'Camp published')
    } catch {
      toast.error('Failed to update')
    }
  }

  const filtered = camps.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Camps</h1>
          <p className="text-obsidian/40 text-sm">{camps.length} total camps</p>
        </div>
        <Link
          href="/admin/camps/new"
          className="flex items-center gap-2 bg-gold text-white px-5 py-3 text-sm font-medium hover:bg-gold/90 transition-colors"
        >
          <Plus size={16} /> New Camp
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian/30" />
        <input
          type="text"
          placeholder="Search camps…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-obsidian/15 py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Tent size={40} className="mx-auto mb-4 text-obsidian/20" />
          <p className="text-obsidian/30 text-lg font-serif">No camps found</p>
          <Link href="/admin/camps/new" className="mt-4 inline-flex items-center gap-2 text-gold text-sm hover:underline">
            <Plus size={14} /> Create your first camp
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-obsidian/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian/8 bg-beige/40">
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Camp</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Price</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium hidden lg:table-cell">Status</th>
                <th className="text-right px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((camp, i) => (
                <motion.tr
                  key={camp._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-obsidian/5 last:border-0 hover:bg-beige/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 overflow-hidden shrink-0 bg-beige">
                        {camp.heroImage ? (
                          <NextImage src={camp.heroImage} alt={camp.title} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tent size={16} className="text-obsidian/20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-obsidian">{camp.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {camp.featured && <span className="text-[9px] bg-gold/15 text-gold px-1.5 py-0.5 uppercase tracking-wide">Featured</span>}
                          {camp.popular && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 uppercase tracking-wide">Popular</span>}
                          <span className="flex items-center gap-0.5 text-obsidian/30 text-xs">
                            <Star size={10} className="fill-gold text-gold" />
                            {camp.reviewCount > 0 ? camp.rating.toFixed(1) : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-obsidian/60">{camp.location}</span>
                    <span className="block text-xs text-obsidian/30">{camp.durationDays}D</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-sm">{camp.currency}{camp.price.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 ${camp.published ? 'bg-green-100 text-green-700' : 'bg-obsidian/8 text-obsidian/40'}`}>
                      {camp.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => togglePublished(camp)}
                        title={camp.published ? 'Unpublish' : 'Publish'}
                        className="p-2 text-obsidian/30 hover:text-gold transition-colors"
                      >
                        {camp.published ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link href={`/admin/camps/${camp._id}`} className="p-2 text-obsidian/30 hover:text-gold transition-colors">
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => deleteCamp(camp)}
                        disabled={deleting === camp._id}
                        className="p-2 text-obsidian/30 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        {deleting === camp._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
