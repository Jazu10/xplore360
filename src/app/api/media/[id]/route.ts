import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import MediaModel from '@/models/Media'
import { getAdminFromRequest } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const media = await MediaModel.findByIdAndUpdate(params.id, body, { new: true })
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(media)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const media = await MediaModel.findByIdAndDelete(params.id)
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (media.cloudinaryPublicId) {
      await deleteImage(media.cloudinaryPublicId).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
