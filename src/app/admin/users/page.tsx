'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, ShieldOff, ShieldCheck, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  _id: string
  name: string
  email: string
  status: 'active' | 'blacklisted'
  emailVerified: boolean
  createdAt: string
}

type Filter = 'all' | 'active' | 'blacklisted'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async (f: Filter, s: string, p: number, append = false) => {
    if (!append) setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (f !== 'all') params.set('status', f)
      if (s) params.set('search', s)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (append) setUsers(prev => [...prev, ...data.users])
      else setUsers(data.users)
      setTotal(data.total)
      setHasMore(data.hasMore)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    load(filter, debouncedSearch, 1)
  }, [filter, debouncedSearch, load])

  const loadMore = async () => {
    const next = page + 1
    await load(filter, debouncedSearch, next, true)
    setPage(next)
  }

  const toggleStatus = async (user: User) => {
    const next = user.status === 'active' ? 'blacklisted' : 'active'
    setActionId(user._id)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(next === 'blacklisted' ? `${user.name} blacklisted` : `${user.name} reactivated`)
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: next } : u))
    } catch {
      toast.error('Failed to update')
    } finally {
      setActionId(null)
    }
  }

  const toggleVerified = async (user: User) => {
    setActionId(user._id + '_v')
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailVerified: !user.emailVerified }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(user.emailVerified ? 'Verification removed' : 'Email marked as verified')
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, emailVerified: !user.emailVerified } : u))
    } catch {
      toast.error('Failed to update')
    } finally {
      setActionId(null)
    }
  }

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete ${user.name}? This also removes all their reviews.`)) return
    setActionId(user._id + '_d')
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u._id !== user._id))
      setTotal(t => t - 1)
    } catch {
      toast.error('Failed to delete')
    } finally {
      setActionId(null)
    }
  }

  const blacklistedCount = users.filter(u => u.status === 'blacklisted').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-obsidian mb-1">Members</h1>
          <p className="text-obsidian/40 text-sm">{total} registered · {blacklistedCount} blacklisted</p>
        </div>
        <button onClick={() => load(filter, debouncedSearch, 1)} className="flex items-center gap-2 text-obsidian/40 hover:text-obsidian text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full border border-obsidian/15 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="flex gap-1 border-b border-obsidian/10">
          {(['all', 'active', 'blacklisted'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm capitalize transition-colors ${filter === f ? 'border-b-2 border-gold text-obsidian font-medium' : 'text-obsidian/40 hover:text-obsidian'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-obsidian/30">
          <p className="font-serif text-xl">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-obsidian/8 text-left text-obsidian/40 text-xs tracking-widest uppercase">
                <th className="pb-3 pr-6 font-normal">Member</th>
                <th className="pb-3 pr-6 font-normal">Joined</th>
                <th className="pb-3 pr-6 font-normal">Email</th>
                <th className="pb-3 pr-6 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian/5">
              {users.map((user, i) => (
                <motion.tr key={user._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={user.status === 'blacklisted' ? 'opacity-60' : ''}
                >
                  <td className="py-4 pr-6">
                    <div>
                      <p className="font-medium text-obsidian">{user.name}</p>
                      <p className="text-obsidian/40 text-xs mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-6 text-obsidian/50">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 pr-6">
                    <button
                      onClick={() => toggleVerified(user)}
                      disabled={actionId === user._id + '_v'}
                      title={user.emailVerified ? 'Mark as unverified' : 'Mark as verified'}
                      className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50"
                    >
                      {actionId === user._id + '_v'
                        ? <Loader2 size={12} className="animate-spin text-obsidian/30" />
                        : user.emailVerified
                          ? <CheckCircle size={13} className="text-green-500" />
                          : <XCircle size={13} className="text-obsidian/20" />
                      }
                      <span className={user.emailVerified ? 'text-green-600' : 'text-obsidian/30'}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 pr-6">
                    <span className={`text-xs px-2 py-1 ${user.status === 'blacklisted' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleStatus(user)}
                        disabled={actionId === user._id}
                        title={user.status === 'blacklisted' ? 'Reactivate user' : 'Blacklist user'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors disabled:opacity-50 ${
                          user.status === 'blacklisted'
                            ? 'border-green-200 text-green-600 hover:bg-green-50'
                            : 'border-red-200 text-red-500 hover:bg-red-50'
                        }`}
                      >
                        {actionId === user._id
                          ? <Loader2 size={12} className="animate-spin" />
                          : user.status === 'blacklisted'
                            ? <ShieldCheck size={12} />
                            : <ShieldOff size={12} />
                        }
                        {user.status === 'blacklisted' ? 'Reactivate' : 'Blacklist'}
                      </button>
                      <button
                        onClick={() => deleteUser(user)}
                        disabled={!!actionId}
                        title="Delete user"
                        className="p-2 text-obsidian/20 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button onClick={loadMore}
            className="border border-obsidian/20 text-obsidian/60 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
