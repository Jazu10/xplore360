'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import CampForm from '../CampForm'

export default function EditCampPage() {
  const { id } = useParams<{ id: string }>()
  const [camp, setCamp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/camps/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setCamp({
          ...d,
          _id: d._id,
          tags: Array.isArray(d.tags) ? d.tags.join(', ') : d.tags || '',
          highlights: Array.isArray(d.highlights) ? d.highlights.join('\n') : d.highlights || '',
          included: Array.isArray(d.included) ? d.included.join('\n') : d.included || '',
          excluded: Array.isArray(d.excluded) ? d.excluded.join('\n') : d.excluded || '',
        })
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={28} className="text-gold animate-spin" />
    </div>
  )

  return <CampForm initial={camp ?? undefined} isEdit />
}
