import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import TestimonialModel from '@/models/Testimonial'
import { getAdminFromRequest } from '@/lib/auth'
import { seedIfEmpty } from '@/lib/seed'
import testimonialsJson from '@/data/testimonials.json'

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json(testimonialsJson)
  }
  try {
    await connectDB()
    await seedIfEmpty()
    const testimonials = await TestimonialModel.find({ published: true }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(testimonials)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const testimonial = await TestimonialModel.create(body)
    return NextResponse.json(testimonial, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
