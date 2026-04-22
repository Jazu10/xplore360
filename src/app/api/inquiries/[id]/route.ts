import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'
import InquiryModel from '@/models/Inquiry'
import { getAdminFromRequest } from '@/lib/auth'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const { status } = await req.json()
    const inquiry = await InquiryModel.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
    if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(inquiry)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!isDBConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    await InquiryModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
