'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, Loader2, Save, ArrowLeft, GripVertical } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import { SITE_SLUG } from '@/lib/site-config'

interface ItineraryDay { day: number; title: string; description: string; meals: string; accommodation: string }

interface PackageFormData {
  _id?: string
  slug: string
  title: string
  subtitle: string
  destination: string
  duration: string
  durationDays: number
  price: number
  originalPrice: number | ''
  currency: string
  category: string
  tags: string
  heroImage: string
  gallery: string[]
  overview: string
  highlights: string
  included: string
  excluded: string
  itinerary: ItineraryDay[]
  instagramVideos: string
  featured: boolean
  popular: boolean
  published: boolean
}

const EMPTY_FORM: PackageFormData = {
  slug: '', title: '', subtitle: '', destination: '', duration: '', durationDays: 7,
  price: 0, originalPrice: '', currency: 'GBP', category: 'Beach & Islands',
  tags: '', heroImage: '', gallery: [], overview: '',
  highlights: '', included: '', excluded: '', itinerary: [],
  instagramVideos: '', featured: false, popular: false, published: true,
}

const CATEGORIES = ['Beach & Islands', 'City & Culture', 'Culture & Wellness', 'Culture & Heritage', 'Adventure']

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface PackageFormProps {
  initial?: Partial<PackageFormData> & { _id?: string }
  isEdit?: boolean
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

export default function PackageForm({ initial, isEdit = false }: PackageFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<PackageFormData>({ ...EMPTY_FORM, ...initial })
  const [saving, setSaving] = useState(false)
  const [openDays, setOpenDays] = useState<number[]>([0])

  const set = <K extends keyof PackageFormData>(key: K, val: PackageFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : toSlug(title) }))
  }

  // Itinerary helpers
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
    const updated = form.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }))
    set('itinerary', updated)
  }
  const toggleDay = (i: number) =>
    setOpenDays((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])

  // Gallery
  const addGalleryUrl = () => set('gallery', [...form.gallery, ''])
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
      instagramVideos: form.instagramVideos.split('\n').map((s) => s.trim()).filter(Boolean),
      originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
    }

    try {
      const url = isEdit ? `/api/packages/${form._id}` : '/api/packages'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      toast.success(isEdit ? 'Package updated!' : 'Package created!')
      router.push('/admin/packages')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full border border-obsidian/15 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
  const textareaCls = `${inputCls} resize-none`

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-obsidian/5 rounded-sm">
          <ArrowLeft size={18} className="text-obsidian/50" />
        </button>
        <div>
          <h1 className="font-serif text-3xl text-obsidian">
            {isEdit ? 'Edit Package' : 'New Package'}
          </h1>
          <p className="text-obsidian/40 text-sm">{isEdit ? `Editing: ${form.title}` : 'Fill in all required fields'}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="accent-gold" />
            <span className="text-sm text-obsidian/60">Published</span>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Package'}
          </button>
        </div>
      </div>

      {/* Section: Basic Info */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-5">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Package Title" required>
            <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputCls} placeholder="e.g. Maldives Luxury Escape" />
          </Field>
          <Field label="URL Slug" required>
            <input type="text" required value={form.slug} onChange={(e) => set('slug', toSlug(e.target.value))} className={inputCls} placeholder="auto-generated from title" />
          </Field>
          <Field label="Subtitle" required>
            <input type="text" required value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputCls} placeholder="Short tagline" />
          </Field>
          <Field label="Destination" required>
            <input type="text" required value={form.destination} onChange={(e) => set('destination', e.target.value)} className={inputCls} placeholder="e.g. Maldives" />
          </Field>
          <Field label="Duration (display)" required>
            <input type="text" required value={form.duration} onChange={(e) => set('duration', e.target.value)} className={inputCls} placeholder="e.g. 7 Nights / 8 Days" />
          </Field>
          <Field label="Duration (days)" required>
            <input type="number" required min={1} value={form.durationDays} onChange={(e) => set('durationDays', Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Price (GBP £)" required>
            <input type="number" required min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Original Price (optional — shows as crossed out)">
            <input type="number" min={0} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value === '' ? '' : Number(e.target.value))} className={inputCls} placeholder="Leave blank if no sale" />
          </Field>
          <Field label="Category" required>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma-separated)">
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="Beach, Luxury, Honeymoon" />
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

      {/* Section: Images */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-6">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Images</h2>
        <ImageUpload label="Hero Image *" value={form.heroImage} onChange={(url) => set('heroImage', url)} folder={`${SITE_SLUG}/packages`} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs tracking-[0.2em] uppercase text-obsidian/50">Gallery Images</label>
            <button type="button" onClick={addGalleryUrl} className="text-xs text-gold flex items-center gap-1 hover:underline">
              <Plus size={12} /> Add Slot
            </button>
          </div>
          {form.gallery.length === 0 ? (
            <p className="text-obsidian/30 text-sm text-center py-6 border border-dashed border-obsidian/10">
              No gallery images. Click &quot;Add Slot&quot; to upload images.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative">
                  <ImageUpload
                    value={url}
                    onChange={(val) => updateGallery(i, val)}
                    folder={`${SITE_SLUG}/packages`}
                  />
                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section: Description */}
      <section className="bg-white border border-obsidian/8 p-8 space-y-5">
        <h2 className="font-serif text-xl text-obsidian border-b border-obsidian/8 pb-4">Description</h2>
        <Field label="Overview" required>
          <textarea required rows={5} value={form.overview} onChange={(e) => set('overview', e.target.value)} className={textareaCls} placeholder="Full description of the package…" />
        </Field>
        <Field label="Highlights (one per line)">
          <textarea rows={5} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} className={textareaCls} placeholder="Private sunset cruise&#10;Coral reef snorkelling&#10;Couples spa treatment" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="What's Included (one per line)">
            <textarea rows={6} value={form.included} onChange={(e) => set('included', e.target.value)} className={textareaCls} placeholder="Return flights from London&#10;7 nights accommodation&#10;Daily breakfast" />
          </Field>
          <Field label="Not Included (one per line)">
            <textarea rows={6} value={form.excluded} onChange={(e) => set('excluded', e.target.value)} className={textareaCls} placeholder="Travel insurance&#10;Visa fees&#10;Personal expenses" />
          </Field>
        </div>
        <Field label="Instagram / Media URLs (one per line)">
          <textarea rows={3} value={form.instagramVideos} onChange={(e) => set('instagramVideos', e.target.value)} className={textareaCls} placeholder="https://www.instagram.com/reel/xxx/&#10;https://www.instagram.com/p/xxx/" />
        </Field>
      </section>

      {/* Section: Itinerary */}
      <section className="bg-white border border-obsidian/8 p-8">
        <div className="flex items-center justify-between border-b border-obsidian/8 pb-4 mb-6">
          <h2 className="font-serif text-xl text-obsidian">Day-by-Day Itinerary</h2>
          <button type="button" onClick={addDay} className="flex items-center gap-2 bg-gold text-white px-4 py-2 text-xs tracking-wide uppercase hover:bg-gold-dark transition-colors">
            <Plus size={13} /> Add Day
          </button>
        </div>

        {form.itinerary.length === 0 ? (
          <p className="text-obsidian/30 text-sm text-center py-10">
            No itinerary days yet. Click &quot;Add Day&quot; to start building.
          </p>
        ) : (
          <div className="space-y-2">
            {form.itinerary.map((day, i) => (
              <div key={i} className="border border-obsidian/10">
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-beige transition-colors"
                >
                  <GripVertical size={14} className="text-obsidian/20 shrink-0" />
                  <span className="w-8 h-8 bg-gold text-white flex items-center justify-center text-sm font-medium shrink-0">
                    {day.day}
                  </span>
                  <span className="flex-1 font-medium text-sm text-obsidian">
                    {day.title || <span className="text-obsidian/30 italic">Untitled day…</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeDay(i) }}
                      className="p-1.5 text-obsidian/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    <ChevronDown size={16} className={`text-obsidian/40 transition-transform duration-300 ${openDays.includes(i) ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {openDays.includes(i) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-obsidian/5">
                        <div className="md:col-span-2">
                          <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-1.5">Day Title</label>
                          <input type="text" value={day.title} onChange={(e) => updateDay(i, 'title', e.target.value)} className={inputCls} placeholder="e.g. Arrival in Paradise" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-1.5">Description</label>
                          <textarea rows={4} value={day.description} onChange={(e) => updateDay(i, 'description', e.target.value)} className={textareaCls} placeholder="What happens on this day…" />
                        </div>
                        <div>
                          <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-1.5">Meals</label>
                          <input type="text" value={day.meals} onChange={(e) => updateDay(i, 'meals', e.target.value)} className={inputCls} placeholder="e.g. Breakfast & Dinner" />
                        </div>
                        <div>
                          <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-1.5">Accommodation</label>
                          <input type="text" value={day.accommodation} onChange={(e) => updateDay(i, 'accommodation', e.target.value)} className={inputCls} placeholder="e.g. Overwater Villa, Maldives" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit bar */}
      <div className="flex items-center justify-end gap-4 py-4 border-t border-obsidian/10">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-obsidian/15 text-sm text-obsidian/60 hover:border-obsidian/30 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-gold text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : isEdit ? 'Update Package' : 'Create Package'}
        </button>
      </div>
    </form>
  )
}
