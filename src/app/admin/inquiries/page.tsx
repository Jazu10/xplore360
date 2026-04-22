'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Loader2, Phone, Package, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { buildWhatsAppUrl, buildEmailUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Inquiry {
  _id: string; name: string; email: string; phone?: string
  destination?: string; packageName?: string; message: string
  status: 'new' | 'read' | 'replied'; createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  read: 'bg-blue-50 text-blue-600',
  replied: 'bg-green-100 text-green-700',
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Inquiry | null>(null)

  const load = () => {
    fetch('/api/inquiries').then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setItems(d) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const markStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.map((i) => i._id === id ? { ...i, status: status as Inquiry['status'] } : i))
      if (selected?._id === id) setSelected((s) => s ? { ...s, status: status as Inquiry['status'] } : null)
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
      setItems((p) => p.filter((i) => i._id !== id))
      if (selected?._id === id) setSelected(null)
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)
  const counts = { new: items.filter((i) => i.status === 'new').length, read: items.filter((i) => i.status === 'read').length, replied: items.filter((i) => i.status === 'replied').length }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-obsidian mb-1">Enquiries</h1>
        <p className="text-obsidian/40 text-sm">{items.length} total · {counts.new} new</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-obsidian/8 p-1 w-fit">
        {(['all', 'new', 'read', 'replied'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${filter === f ? 'bg-gold text-white' : 'text-obsidian/40 hover:text-obsidian'}`}>
            {f} {f !== 'all' && counts[f] > 0 && <span className="ml-1 opacity-70">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={28} className="text-gold animate-spin" /></div>
      ) : (
        <div className="flex gap-6">
          {/* List */}
          <div className="flex-1 space-y-2">
            {filtered.length === 0 ? (
              <p className="text-obsidian/30 text-center py-16 font-serif text-xl">No enquiries</p>
            ) : (
              filtered.map((inq, i) => (
                <motion.button key={inq._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelected(inq); if (inq.status === 'new') markStatus(inq._id, 'read') }}
                  className={`w-full text-left bg-white border p-5 hover:border-gold transition-all ${selected?._id === inq._id ? 'border-gold' : 'border-obsidian/8'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${inq.status === 'new' ? 'bg-amber-500' : inq.status === 'replied' ? 'bg-green-500' : 'bg-obsidian/20'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-obsidian truncate">{inq.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wide shrink-0 ${STATUS_STYLES[inq.status]}`}>{inq.status}</span>
                      </div>
                      {inq.packageName && <p className="text-gold text-xs mt-0.5 truncate">{inq.packageName}</p>}
                      <p className="text-obsidian/40 text-xs mt-1 truncate">{inq.message}</p>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-80 shrink-0 bg-white border border-obsidian/8 p-6 self-start sticky top-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg text-obsidian">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-obsidian/30 hover:text-obsidian text-sm">✕</button>
              </div>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex items-center gap-2 text-obsidian/60">
                  <Mail size={13} className="text-gold shrink-0" />
                  <a href={`mailto:${selected.email}`} className="truncate hover:text-gold">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-obsidian/60">
                    <Phone size={13} className="text-gold shrink-0" />
                    <a href={`tel:${selected.phone}`} className="hover:text-gold">{selected.phone}</a>
                  </div>
                )}
                {selected.packageName && (
                  <div className="flex items-start gap-2 text-obsidian/60">
                    <Package size={13} className="text-gold shrink-0 mt-0.5" />
                    <span>{selected.packageName}</span>
                  </div>
                )}
              </div>

              <div className="bg-beige p-4 mb-5">
                <div className="flex items-center gap-1.5 text-obsidian/40 text-xs mb-2">
                  <MessageSquare size={11} /> Message
                </div>
                <p className="text-sm text-obsidian/70 leading-relaxed">{selected.message}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a href={buildEmailUrl('', `Re: ${selected.packageName || 'Your Travel Enquiry'}`, `Dear ${selected.name},\n\nThank you for your enquiry...`).replace('mailto:', `mailto:${selected.email}`)}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-white py-2.5 text-xs tracking-wide uppercase hover:bg-gold-dark transition-colors">
                  <Mail size={13} /> Reply by Email
                </a>
                {selected.phone && (
                  <a href={buildWhatsAppUrl('447700000000', `Hello ${selected.name}! Thank you for your enquiry about ${selected.packageName || 'our packages'}.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 text-xs tracking-wide uppercase hover:bg-[#1ebe57] transition-colors">
                    <MessageSquare size={13} /> WhatsApp
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button onClick={() => markStatus(selected._id, 'replied')}
                    className="flex items-center justify-center gap-1.5 border border-green-300 text-green-600 py-2 text-xs hover:bg-green-50 transition-colors">
                    <CheckCircle size={12} /> Mark Replied
                  </button>
                  <button onClick={() => markStatus(selected._id, 'new')}
                    className="flex items-center justify-center gap-1.5 border border-obsidian/15 text-obsidian/50 py-2 text-xs hover:border-obsidian/30 transition-colors">
                    <Clock size={12} /> Mark New
                  </button>
                </div>
                <button onClick={() => deleteItem(selected._id)}
                  className="w-full flex items-center justify-center gap-2 text-red-500 text-xs py-2 hover:bg-red-50 transition-colors border border-red-200 mt-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
