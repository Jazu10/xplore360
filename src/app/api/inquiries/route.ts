import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import InquiryModel from '@/models/Inquiry'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json([])

  try {
    await connectDB()
    const inquiries = await InquiryModel.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(inquiries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}
