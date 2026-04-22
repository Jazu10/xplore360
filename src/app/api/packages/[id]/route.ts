import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import PackageModel from '@/models/Package'
import { getAdminFromRequest } from '@/lib/auth'
import packagesJson from '@/data/packages.json'

type Params = { params: { id: string } }

// GET /api/packages/[id] — id can be MongoDB _id OR slug
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = params

  if (!isDBConfigured()) {
    const pkg = packagesJson.find((p) => p.slug === id || p.id === id)
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  }

  try {
    await connectDB()
    const pkg = await PackageModel.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[0-9a-f]{24}$/) ? id : null }],
    }).lean()

    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

// PUT /api/packages/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const pkg = await PackageModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

// DELETE /api/packages/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(_req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const pkg = await PackageModel.findByIdAndDelete(params.id)
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
