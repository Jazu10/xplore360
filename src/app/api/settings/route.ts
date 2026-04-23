import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import SettingsModel from '@/models/Settings'
import { getAdminFromRequest } from '@/lib/auth'
import { seedIfEmpty } from '@/lib/seed'
import configJson from '@/data/config.json'

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json(configJson)
  }

  try {
    await connectDB()
    await seedIfEmpty()
    const settings = await SettingsModel.findOne().lean()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const body = await req.json()
    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, lean: true, runValidators: false }
    )
    return NextResponse.json(updated)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}
