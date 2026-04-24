import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'

export const dynamic = 'force-dynamic'
import CampModel from '@/models/Camp'
import { getAdminFromRequest } from '@/lib/auth'
import campsJson from '@/data/camps.json'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get('featured') === 'true'

  if (!isDBConfigured()) {
    const data = featured ? campsJson.filter((c) => c.featured) : campsJson
    return NextResponse.json(data)
  }

  try {
    await connectDB()
    const query: Record<string, unknown> = { published: true }
    if (featured) query.featured = true
    const camps = await CampModel.find(query).lean()
    return NextResponse.json(camps)
  } catch {
    return NextResponse.json(campsJson)
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const camp = await CampModel.create(body)
    return NextResponse.json(camp, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}
