'use client'

import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2, Star, X, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface Testimonial {
  _id: string; name: string; location: string; avatar: string
  rating: number; text: string; packageName: string; date: string; published: boolean
}

const EMPTY = { name: '', location: '', avatar: '', rating: 5, text: '', packageName: '', date: '', published: true }

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'new' | Testimonial>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/testimonials').then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setItems(d) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setModal('new') }
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setModal(t) }

  const save = async () => {
    if (!form.name || !form.text) { toast.error('Name and text are required'); return }
    setSaving(true)
    const isEdit = modal !== 'new' && modal !== null
    const id = isEdit ? (modal as Testimonial)._id : null
    try {
      const res = await fetch(id ? `/api/testimonials/${id}` : '/api/testimonials', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(id ? 'Updated!' : 'Added!')
      load(); setModal(null)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setSaving(false) }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      setItems((p) => p.filter((i) => i._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  const inputCls = "w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors"

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Testimonials</h1>
          <p className="text-obsidian/40 text-sm">{items.length} reviews</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-white px-5 py-3 text-sm font-medium hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg p-8 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-obsidian">{modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h2>
                <button onClick={() => setModal(null)} className="text-obsidian/40 hover:text-obsidian"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Customer name" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className={inputCls} placeholder="London, UK" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Package</label>
                    <input type="text" value={form.packageName} onChange={(e) => setForm((f) => ({ ...f, packageName: e.target.value }))} className={inputCls} placeholder="Maldives Luxury Escape" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Date</label>
                    <input type="text" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputCls} placeholder="March 2024" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))}>
                        <Star size={22} className={n <= form.rating ? 'fill-gold text-gold' : 'text-obsidian/20'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Review Text *</label>
                  <textarea rows={5} required value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Customer's review…" />
                </div>
                <ImageUpload label="Avatar (optional)" value={form.avatar} onChange={(url) => setForm((f) => ({ ...f, avatar: url }))} folder="xplore360/avatars" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-gold" />
                  <span className="text-sm text-obsidian/60">Published</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(null)} className="flex-1 py-3 border border-obsidian/15 text-sm text-obsidian/60 hover:border-obsidian/30 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm font-medium hover:bg-gold-dark disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  {saving ? 'Saving…' : modal === 'new' ? 'Add Review' : 'Update'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={28} className="text-gold animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white border border-obsidian/8 p-6">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-beige shrink-0">
                  {t.avatar ? <NextImage src={t.avatar} alt={t.name} fill className="object-cover" sizes="48px" /> : <span className="flex items-center justify-center w-full h-full text-obsidian/30 font-serif text-lg">{t.name[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-obsidian">{t.name}</p>
                  <p className="text-obsidian/40 text-xs">{t.location} · {t.packageName}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={11} className="fill-gold text-gold" />)}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} className="p-2 text-obsidian/30 hover:text-gold transition-colors"><Edit size={14} /></button>
                  <button onClick={() => deleteItem(t._id)} className="p-2 text-obsidian/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-obsidian/60 text-sm leading-relaxed mt-3 line-clamp-3 italic">&ldquo;{t.text}&rdquo;</p>
              {!t.published && <span className="mt-2 inline-block text-[10px] bg-obsidian/5 text-obsidian/40 px-2 py-1 uppercase tracking-wide">Draft</span>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
