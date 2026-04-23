import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import CampModel from '@/models/Camp'
import { getAdminFromRequest } from '@/lib/auth'
import campsJson from '@/data/camps.json'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDBConfigured()) {
    const camp = campsJson.find((c) => c.slug === params.id)
    return camp ? NextResponse.json(camp) : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  try {
    await connectDB()
    const camp = await CampModel.findOne({ $or: [{ _id: params.id }, { slug: params.id }] }).lean()
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(camp)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    await connectDB()
    const body = await req.json()
    const camp = await CampModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(camp)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    await connectDB()
    await CampModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
