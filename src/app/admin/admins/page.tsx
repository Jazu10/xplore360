'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Trash2, KeyRound, ShieldCheck, User, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Admin {
  _id: string
  username: string
  email?: string
  role: 'admin' | 'superadmin'
  createdAt: string
}

const EMPTY_FORM = { username: '', password: '', email: '', role: 'admin' as Admin['role'] }

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState<string | null>(null)
  const [newPw, setNewPw] = useState('')
  const [dbError, setDbError] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/admins')
      if (res.status === 503) { setDbError(true); return }
      const data = await res.json()
      setAdmins(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Admin "${form.username}" created`)
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Delete admin "${admin.username}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/admins/${admin._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Admin deleted')
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    }
  }

  const handleChangePassword = async (id: string) => {
    if (!newPw.trim()) return
    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Password updated')
      setChangingPw(null)
      setNewPw('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    }
  }

  if (dbError) {
    return (
      <div className="p-10 flex items-center gap-3 text-obsidian/50">
        <AlertCircle size={18} className="text-amber-500" />
        <span>Admin accounts require MongoDB. Add <code className="bg-obsidian/8 px-1.5 py-0.5 text-xs">MONGODB_URI</code> to your .env.local to manage multiple admins.</span>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian">Admin Accounts</h1>
          <p className="text-obsidian/40 text-sm mt-1">Manage who can access this panel</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm tracking-wide hover:bg-gold/90 transition-colors"
        >
          <UserPlus size={15} /> Add Admin
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onSubmit={handleCreate}
            className="bg-white border border-obsidian/10 p-6 mb-6 space-y-4"
          >
            <h2 className="font-serif text-lg text-obsidian">New Admin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Username *</label>
                <input
                  required value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                  placeholder="e.g. sarah"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Password *</label>
                <input
                  required type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Email (optional)</label>
                <input
                  type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-obsidian/40 mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Admin['role'] })}
                  className="w-full border border-obsidian/15 py-2.5 px-3 text-sm focus:outline-none focus:border-gold bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-obsidian text-white px-5 py-2.5 text-sm hover:bg-obsidian/80 transition-colors disabled:opacity-50">
                {saving && <Loader2 size={14} className="animate-spin" />}
                Create Admin
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm text-obsidian/50 hover:text-obsidian border border-obsidian/15 hover:border-obsidian/30 transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Admin list */}
      {loading ? (
        <div className="flex items-center gap-2 text-obsidian/40 py-12">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin._id} className="bg-white border border-obsidian/8 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-obsidian/8 flex items-center justify-center shrink-0">
                    {admin.role === 'superadmin'
                      ? <ShieldCheck size={18} className="text-gold" />
                      : <User size={18} className="text-obsidian/40" />}
                  </div>
                  <div>
                    <p className="font-medium text-obsidian">{admin.username}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 ${admin.role === 'superadmin' ? 'bg-gold/10 text-gold' : 'bg-obsidian/8 text-obsidian/50'}`}>
                        {admin.role}
                      </span>
                      {admin.email && <span className="text-xs text-obsidian/40">{admin.email}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setChangingPw(changingPw === admin._id ? null : admin._id); setNewPw('') }}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 border border-obsidian/15 text-obsidian/50 hover:text-obsidian hover:border-obsidian/30 transition-colors"
                  >
                    <KeyRound size={12} /> Password
                  </button>
                  <button
                    onClick={() => handleDelete(admin)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Inline password change */}
              <AnimatePresence>
                {changingPw === admin._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-obsidian/8">
                      <input
                        type="password" value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="New password"
                        className="flex-1 border border-obsidian/15 py-2 px-3 text-sm focus:outline-none focus:border-gold"
                      />
                      <button
                        onClick={() => handleChangePassword(admin._id)}
                        className="bg-gold text-white px-4 py-2 text-sm hover:bg-gold/90 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
