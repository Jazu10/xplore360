'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import PackageForm from '../PackageForm'

export default function EditPackagePage() {
  const { id } = useParams<{ id: string }>()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/packages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        // Convert arrays back to textarea strings for the form
        setPkg({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
          highlights: Array.isArray(data.highlights) ? data.highlights.join('\n') : data.highlights || '',
          included: Array.isArray(data.included) ? data.included.join('\n') : data.included || '',
          excluded: Array.isArray(data.excluded) ? data.excluded.join('\n') : data.excluded || '',
          instagramVideos: Array.isArray(data.instagramVideos) ? data.instagramVideos.join('\n') : data.instagramVideos || '',
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
        })
      })
      .catch(() => setError('Failed to load package'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={32} className="text-gold animate-spin" />
    </div>
  )

  if (error || !pkg) return (
    <div className="p-8 text-red-500 font-serif text-xl">{error || 'Package not found'}</div>
  )

  return <PackageForm initial={pkg} isEdit />
}
