import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import PackageModel from '@/models/Package'
import { getAdminFromRequest } from '@/lib/auth'
import { seedIfEmpty } from '@/lib/seed'
import packagesJson from '@/data/packages.json'

// GET /api/packages
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const featured = searchParams.get('featured')
  const destination = searchParams.get('destination')
  const category = searchParams.get('category')

  if (!isDBConfigured()) {
    // Fallback to JSON
    let data = packagesJson
    if (featured === 'true') data = data.filter((p) => p.featured)
    if (destination) data = data.filter((p) => p.destination === destination)
    if (category) data = data.filter((p) => p.category === category)
    return NextResponse.json(data)
  }

  try {
    await connectDB()
    await seedIfEmpty()

    const query: Record<string, unknown> = { published: true }
    if (featured === 'true') query.featured = true
    if (destination) query.destination = destination
    if (category) query.category = category

    const packages = await PackageModel.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(packages)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

// POST /api/packages (admin only)
export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!isDBConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    await connectDB()
    const body = await req.json()

    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const pkg = await PackageModel.create(body)
    return NextResponse.json(pkg, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create package'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
