'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Tent, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Camp {
  _id: string; slug: string; title: string; location: string
  price: number; currency: string; featured: boolean; published: boolean; category: string
}

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/camps', { credentials: 'include' })
      const data = await res.json()
      setCamps(Array.isArray(data) ? data : [])
    } catch { toast.error('Failed to load camps') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const togglePublish = async (camp: Camp) => {
    try {
      const res = await fetch(`/api/camps/${camp._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !camp.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(camp.published ? 'Camp unpublished' : 'Camp published')
      load()
    } catch { toast.error('Failed to update') }
  }

  const deleteCamp = async (camp: Camp) => {
    if (!confirm(`Delete "${camp.title}"?`)) return
    try {
      await fetch(`/api/camps/${camp._id}`, { method: 'DELETE', credentials: 'include' })
      toast.success('Camp deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian">Camps</h1>
          <p className="text-obsidian/40 text-sm mt-1">{camps.length} camp{camps.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/camps/new"
          className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm tracking-wide hover:bg-gold/90 transition-colors">
          <Plus size={15} /> New Camp
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-obsidian/40 py-12">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : camps.length === 0 ? (
        <div className="text-center py-20 text-obsidian/30">
          <Tent size={40} className="mx-auto mb-4 opacity-30" />
          <p>No camps yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {camps.map((camp, i) => (
            <motion.div key={camp._id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-obsidian/8 p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-medium text-obsidian">{camp.title}</p>
                  {camp.featured && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 tracking-widest uppercase">Featured</span>}
                  {!camp.published && <span className="text-[10px] bg-obsidian/8 text-obsidian/40 px-2 py-0.5 tracking-widest uppercase">Draft</span>}
                </div>
                <p className="text-sm text-obsidian/40 mt-0.5">{camp.location} · {camp.category} · {camp.currency}{camp.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(camp)}
                  className="p-2 text-obsidian/30 hover:text-obsidian transition-colors" title={camp.published ? 'Unpublish' : 'Publish'}>
                  {camp.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <Link href={`/admin/camps/${camp._id}`}
                  className="p-2 text-obsidian/30 hover:text-gold transition-colors">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => deleteCamp(camp)}
                  className="p-2 text-obsidian/30 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
