'use client'

import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2, Film, Image as ImageIcon, Link as LinkIcon, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface MediaItem {
  _id: string; type: string; url: string; thumbnailUrl: string
  caption: string; instagramUrl?: string; published: boolean
}

const MEDIA_TYPES = [
  { value: 'instagram_post', label: 'Instagram Post', icon: ImageIcon },
  { value: 'instagram_reel', label: 'Instagram Reel', icon: Film },
  { value: 'uploaded_image', label: 'Uploaded Image', icon: Upload },
]

const EMPTY = { type: 'instagram_post', url: '', thumbnailUrl: '', caption: '', instagramUrl: '' }

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    fetch('/api/media').then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setItems(d) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleFileUpload = async (file: File, field: 'url' | 'thumbnailUrl') => {
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'xplore360/media')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm((f) => ({ ...f, [field]: data.url, thumbnailUrl: data.url }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.thumbnailUrl) { toast.error('Thumbnail URL is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/media', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, url: form.url || form.thumbnailUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems((prev) => [data, ...prev])
      setForm(EMPTY); setShowForm(false)
      toast.success('Media item added!')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setSaving(false) }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this media item?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((i) => i._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Media</h1>
          <p className="text-obsidian/40 text-sm">Instagram posts, reels, and uploaded images</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold text-white px-5 py-3 text-sm font-medium hover:bg-gold-dark transition-colors"
        >
          <Plus size={16} /> Add Media
        </button>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-obsidian">Add Media Item</h2>
                <button onClick={() => setShowForm(false)} className="text-obsidian/40 hover:text-obsidian">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold">
                    {MEDIA_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Upload or URL */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Image / Thumbnail</label>
                  <div className="flex gap-2">
                    <input type="url" placeholder="Paste image URL…" value={form.thumbnailUrl}
                      onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value, url: e.target.value }))}
                      className="flex-1 border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold"
                    />
                    <label className="flex items-center gap-1.5 border border-obsidian/15 px-4 py-3 text-sm text-obsidian/50 hover:border-gold hover:text-gold cursor-pointer transition-colors whitespace-nowrap">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Upload
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'url')} />
                    </label>
                  </div>
                  {form.thumbnailUrl && (
                    <div className="relative w-full aspect-video mt-2 overflow-hidden border border-obsidian/10">
                      <NextImage src={form.thumbnailUrl} alt="Preview" fill className="object-cover" sizes="400px" />
                    </div>
                  )}
                </div>

                {/* Instagram URL (optional) */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">
                    <LinkIcon size={11} className="inline mr-1" />
                    Instagram URL (optional — links out)
                  </label>
                  <input type="url" placeholder="https://www.instagram.com/p/xxx/" value={form.instagramUrl}
                    onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                    className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">Caption</label>
                  <input type="text" placeholder="e.g. Maldives overwater villa" value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                    className="w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-obsidian/15 text-sm text-obsidian/60 hover:border-obsidian/30 transition-colors">
                  Cancel
                </button>
                <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-gold text-white py-3 text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {saving ? 'Adding…' : 'Add Item'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={28} className="text-gold animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <ImageIcon size={40} className="text-obsidian/20 mx-auto mb-4" />
          <p className="text-obsidian/30 font-serif text-xl">No media items yet</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-gold text-sm hover:underline flex items-center gap-1 mx-auto">
            <Plus size={14} /> Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group relative aspect-square bg-beige overflow-hidden border border-obsidian/8">
              <NextImage src={item.thumbnailUrl} alt={item.caption} fill className="object-cover" sizes="250px" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <p className="text-white text-xs text-center line-clamp-2">{item.caption || 'No caption'}</p>
                <span className="text-[10px] text-white/60 uppercase tracking-wider">{item.type?.replace('_', ' ')}</span>
                <button onClick={() => deleteItem(item._id)} disabled={deleting === item._id}
                  className="mt-2 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 text-xs hover:bg-red-600 transition-colors">
                  {deleting === item._id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                  Delete
                </button>
              </div>
              {(item.type === 'instagram_reel') && (
                <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1"><Film size={10} className="text-white" /></div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
