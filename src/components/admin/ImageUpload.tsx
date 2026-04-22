'use client'

import { useState, useRef } from 'react'
import NextImage from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  folder?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  folder = 'xplore360',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs tracking-[0.2em] uppercase text-obsidian/50">{label}</label>
      )}

      {value ? (
        <div className="relative group aspect-video w-full overflow-hidden border border-obsidian/10 bg-beige">
          <NextImage src={value} alt="Uploaded" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 text-sm"
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed border-obsidian/15 hover:border-gold/50 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center gap-3 bg-beige/50"
        >
          {uploading ? (
            <Loader2 size={28} className="text-gold animate-spin" />
          ) : (
            <Upload size={28} className="text-obsidian/30" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-obsidian/60">
              {uploading ? 'Uploading...' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-obsidian/30 mt-1">JPEG, PNG, WebP — max 10MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* URL input fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste image URL directly…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-obsidian/15 py-2 px-3 text-sm focus:outline-none focus:border-gold"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 border border-obsidian/15 text-obsidian/40 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}
