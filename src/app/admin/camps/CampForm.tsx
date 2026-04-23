'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, Loader2, Save, ArrowLeft } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import { SITE_SLUG } from '@/lib/site-config'

interface ItineraryDay { day: number; title: string; description: string; meals: string; accommodation: string }

interface CampFormData {
  _id?: string
  slug: string; title: string; subtitle: string; location: string
  duration: string; durationDays: number; price: number; originalPrice: number | ''
  currency: string; category: string; tags: string; capacity: number | ''; season: string
  heroImage: string; gallery: string[]; overview: string
  highlights: string; included: string; excluded: string
  itinerary: ItineraryDay[]
  featured: boolean; popular: boolean; published: boolean
}

const EMPTY: CampFormData = {
  slug: '', title: '', subtitle: '', location: '', duration: '', durationDays: 1,
  price: 0, originalPrice: '', currency: 'GBP', category: 'Adventure',
  tags: '', capacity: '', season: '', heroImage: '', gallery: [], overview: '',
  highlights: '', included: '', excluded: '', itinerary: [],
  featured: false, popular: false, published: true,
}

const CATEGORIES = ['Adventure', 'Glamping', 'Wild Camping', 'Safari', 'Beach Camp', 'Mountain Camp', 'Family Camp']

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

interface CampFormProps {
  initial?: Partial<CampFormData> & { _id?: string }
  isEdit?: boolean
}

export default function CampForm({ initial, isEdit = false }: CampFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<CampFormData>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [openDays, setOpenDays] = useState<number[]>([0])

  const set = <K extends keyof CampFormData>(key: K, val: CampFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : toSlug(title) }))
  }

  const addDay = () => {
    const next = form.itinerary.length + 1
    setForm((f) => ({
      ...f,
      itinerary: [...f.itinerary, { day: next, title: '', description: '', meals: '', accommodation: '' }],
    }))
    setOpenDays((d) => [...d, form.itinerary.length])
  }
  const updateDay = (i: number, key: keyof ItineraryDay, val: string | number) => {
    const updated = [...form.itinerary]
    updated[i] = { ...updated[i], [key]: val }
    set('itinerary', updated)
  }
  const removeDay = (i: number) => {
    set('itinerary', form.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })))
  }
  const toggleDay = (i: number) =>
    setOpenDays((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])

  const addGallerySlot = () => set('gallery', [...form.gallery, ''])
  const updateGallery = (i: number, val: string) => {
    const updated = [...form.gallery]; updated[i] = val; set('gallery', updated)
  }
  const removeGallery = (i: number) => set('gallery', form.gallery.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      included: form.included.split('\n').map((s) => s.trim()).filter(Boolean),
      excluded: form.excluded.split('\n').map((s) => s.trim()).filter(Boolean),
      originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
      capacity: form.capacity === '' ? undefined : Number(form.capacity),
    }
    try {
      const url = isEdit ? `/api/camps/${form._id}` : '/api/camps'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      toast.success(isEdit ? 'Camp updated!' : 'Camp created!')
      router.push('/admin/camps')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  const inputCls = "w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
  const textareaCls = `${inputCls} resize-none`

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-obsidian/5 rounded-sm">
          <ArrowLeft size={18} className="text-obsidian/50" />
        </button>
        <div>
          <h1 className="font-serif text-3xl text-obsidian">{isEdit ? 'Edit Camp' : 'New Camp'}</h1>
          <p className="text-obsidian/40 text-sm">{isEdit ? `Editing: ${form.title}` : 'Fill in the details'}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-obsidian/60">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="accent-gold" />
            Published
          </label>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm hover:bg-gold/90 disabled:opacity-60 transition-colors">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Camp'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-5">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Camp Title" required>
            <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputCls} placeholder="e.g. Scottish Highlands Wild Camp" />
          </Field>
          <Field label="Slug" required>
            <input type="text" required value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Subtitle">
            <input type="text" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputCls} placeholder="Short tagline" />
          </Field>
          <Field label="Location" required>
            <input type="text" required value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} placeholder="e.g. Scottish Highlands, UK" />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="glamping, wilderness, family" />
          </Field>
          <Field label="Duration (display)">
            <input type="text" value={form.duration} onChange={(e) => set('duration', e.target.value)} className={inputCls} placeholder="e.g. 3 Days / 2 Nights" />
          </Field>
          <Field label="Duration (days)" required>
            <input type="number" required min={1} value={form.durationDays} onChange={(e) => set('durationDays', Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Price (GBP)" required>
            <input type="number" required min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Original Price (optional)">
            <input type="number" min={0} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value === '' ? '' : Number(e.target.value))} className={inputCls} placeholder="Leave blank if no discount" />
          </Field>
          <Field label="Capacity (people)">
            <input type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', e.target.value === '' ? '' : Number(e.target.value))} className={inputCls} placeholder="e.g. 12" />
          </Field>
          <Field label="Season">
            <input type="text" value={form.season} onChange={(e) => set('season', e.target.value)} className={inputCls} placeholder="e.g. April – October" />
          </Field>
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-gold" />
            <span className="text-sm text-obsidian/60">Featured on homepage</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.popular} onChange={(e) => set('popular', e.target.checked)} className="accent-gold" />
            <span className="text-sm text-obsidian/60">Show &quot;Popular&quot; badge</span>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-6">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Images</h2>
        <ImageUpload label="Hero Image *" value={form.heroImage} onChange={(url) => set('heroImage', url)} folder={`${SITE_SLUG}/camps`} />
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs tracking-[0.2em] uppercase text-obsidian/50">Gallery Images</label>
            <button type="button" onClick={addGallerySlot} className="text-xs text-gold flex items-center gap-1 hover:underline">
              <Plus size={12} /> Add Slot
            </button>
          </div>
          {form.gallery.length === 0 ? (
            <p className="text-obsidian/30 text-sm text-center py-6 border border-dashed border-obsidian/10">
              No gallery images. Click &quot;Add Slot&quot; to upload.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative">
                  <ImageUpload value={url} onChange={(val) => updateGallery(i, val)} folder={`${SITE_SLUG}/camps`} />
                  <button type="button" onClick={() => removeGallery(i)}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full hover:bg-red-600 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-5">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Description</h2>
        <Field label="Overview" required>
          <textarea required rows={5} value={form.overview} onChange={(e) => set('overview', e.target.value)} className={textareaCls} placeholder="Full description of the camp experience…" />
        </Field>
        <Field label="Highlights (one per line)">
          <textarea rows={4} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} className={textareaCls} placeholder="Guided loch-side hike&#10;Wild foraging session&#10;Stargazing with guide" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="What's Included (one per line)">
            <textarea rows={5} value={form.included} onChange={(e) => set('included', e.target.value)} className={textareaCls} placeholder="All camping equipment&#10;Meals & snacks&#10;Expert guide" />
          </Field>
          <Field label="Not Included (one per line)">
            <textarea rows={5} value={form.excluded} onChange={(e) => set('excluded', e.target.value)} className={textareaCls} placeholder="Travel to site&#10;Personal items&#10;Alcohol" />
          </Field>
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-white border border-obsidian/8 p-8">
        <div className="flex items-center justify-between border-b border-obsidian/8 pb-4 mb-6">
          <h2 className="font-serif text-xl text-obsidian">Day-by-Day Itinerary</h2>
          <button type="button" onClick={addDay}
            className="flex items-center gap-2 text-sm text-gold border border-gold/30 px-4 py-2 hover:bg-gold/5 transition-colors">
            <Plus size={14} /> Add Day
          </button>
        </div>
        {form.itinerary.length === 0 ? (
          <p className="text-center text-obsidian/30 py-8 text-sm">
            No itinerary days yet. Click &quot;Add Day&quot; to start building.
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {form.itinerary.map((day, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="border border-obsidian/10">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-obsidian/2"
                    onClick={() => toggleDay(i)}>
                    <span className="text-sm font-medium text-obsidian">
                      Day {day.day}{day.title ? `: ${day.title}` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeDay(i) }}
                        className="p-1 text-obsidian/30 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <ChevronDown size={16} className={`text-obsidian/40 transition-transform ${openDays.includes(i) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {openDays.includes(i) && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden">
                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-obsidian/8">
                          <div className="md:col-span-2">
                            <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Day Title</label>
                            <input type="text" value={day.title} onChange={(e) => updateDay(i, 'title', e.target.value)}
                              className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Description</label>
                            <textarea rows={3} value={day.description} onChange={(e) => updateDay(i, 'description', e.target.value)}
                              className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold resize-none bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Meals</label>
                            <input type="text" value={day.meals} onChange={(e) => updateDay(i, 'meals', e.target.value)}
                              className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white"
                              placeholder="Breakfast, Lunch, Dinner" />
                          </div>
                          <div>
                            <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Accommodation</label>
                            <input type="text" value={day.accommodation} onChange={(e) => updateDay(i, 'accommodation', e.target.value)}
                              className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white"
                              placeholder="e.g. Bell tent, Bivvy" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </form>
  )
}
