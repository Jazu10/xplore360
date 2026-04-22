import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import MediaModel from '@/models/Media'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  if (!isDBConfigured()) return NextResponse.json([])

  try {
    await connectDB()
    const media = await MediaModel.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json(media)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const media = await MediaModel.create(body)
    return NextResponse.json(media, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}
