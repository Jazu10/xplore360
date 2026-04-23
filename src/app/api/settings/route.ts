import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import SettingsModel from '@/models/Settings'
import { getAdminFromRequest } from '@/lib/auth'
import { seedIfEmpty } from '@/lib/seed'
import configJson from '@/data/config.json'

export const dynamic = 'force-dynamic'

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
    let settings = await SettingsModel.findOne()
    if (!settings) {
      settings = await SettingsModel.create(body)
    } else {
      Object.assign(settings, body)
      await settings.save()
    }
    return NextResponse.json(settings)
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 400 })
  }
}
