'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Loader2, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Pkg {
  _id?: string; id?: string; slug: string; title: string; destination: string
  price: number; currency: string; heroImage: string; published: boolean
  featured: boolean; popular: boolean; durationDays: number; rating: number
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/packages', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPackages(d) })
      .catch(() => toast.error('Failed to load packages'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const deletePackage = async (pkg: Pkg) => {
    const id = pkg._id || pkg.id
    if (!id || !confirm(`Delete "${pkg.title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Package deleted')
      setPackages((p) => p.filter((x) => (x._id || x.id) !== id))
    } catch {
      toast.error('Failed to delete package')
    } finally {
      setDeleting(null)
    }
  }

  const togglePublished = async (pkg: Pkg) => {
    const id = pkg._id || pkg.id
    if (!id) return
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !pkg.published }),
      })
      if (!res.ok) throw new Error()
      setPackages((prev) => prev.map((p) => (p._id || p.id) === id ? { ...p, published: !p.published } : p))
      toast.success(pkg.published ? 'Package unpublished' : 'Package published')
    } catch {
      toast.error('Failed to update')
    }
  }

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Packages</h1>
          <p className="text-obsidian/40 text-sm">{packages.length} total packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 bg-gold text-white px-5 py-3 text-sm font-medium hover:bg-gold-dark transition-colors"
        >
          <Plus size={16} /> New Package
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian/30" />
        <input
          type="text"
          placeholder="Search packages…"
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
          <p className="text-obsidian/30 text-lg font-serif">No packages found</p>
          <Link href="/admin/packages/new" className="mt-4 inline-flex items-center gap-2 text-gold text-sm hover:underline">
            <Plus size={14} /> Create your first package
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-obsidian/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian/8 bg-beige/40">
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Package</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium hidden md:table-cell">Destination</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Price</th>
                <th className="text-left px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium hidden lg:table-cell">Status</th>
                <th className="text-right px-5 py-3 text-xs tracking-[0.2em] uppercase text-obsidian/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pkg, i) => {
                const id = pkg._id || pkg.id || ''
                return (
                  <motion.tr
                    key={id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-obsidian/5 last:border-0 hover:bg-beige/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 overflow-hidden shrink-0">
                          <NextImage
                            src={pkg.heroImage}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-obsidian">{pkg.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {pkg.featured && <span className="text-[9px] bg-gold/15 text-gold px-1.5 py-0.5 uppercase tracking-wide">Featured</span>}
                            {pkg.popular && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 uppercase tracking-wide">Popular</span>}
                            <span className="flex items-center gap-0.5 text-obsidian/30 text-xs">
                              <Star size={10} className="fill-gold text-gold" />{pkg.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-obsidian/60">{pkg.destination}</span>
                      <span className="block text-xs text-obsidian/30">{pkg.durationDays}N</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-sm">{formatPrice(pkg.price)}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-1 ${pkg.published ? 'bg-green-100 text-green-700' : 'bg-obsidian/8 text-obsidian/40'}`}>
                        {pkg.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => togglePublished(pkg)}
                          title={pkg.published ? 'Unpublish' : 'Publish'}
                          className="p-2 text-obsidian/30 hover:text-gold transition-colors"
                        >
                          {pkg.published ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <Link
                          href={`/admin/packages/${id}`}
                          className="p-2 text-obsidian/30 hover:text-gold transition-colors"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => deletePackage(pkg)}
                          disabled={deleting === id}
                          className="p-2 text-obsidian/30 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          {deleting === id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
