import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { uploadImage, isCloudinaryConfigured } from '@/lib/cloudinary'
import { SITE_SLUG } from '@/lib/site-config'

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary not configured. Set CLOUDINARY_* environment variables.' },
      { status: 503 }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || SITE_SLUG

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer, folder)

    return NextResponse.json({ url: result.url, publicId: result.publicId })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
