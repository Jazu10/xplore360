import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, isEmailConfigured } from '@/lib/email'
import { connectDB, isDBConfigured } from '@/lib/db'
import InquiryModel from '@/models/Inquiry'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, destination, packageName, message } = body

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Save to DB if configured
    if (isDBConfigured()) {
      try {
        await connectDB()
        await InquiryModel.create({ name, email, phone, destination, packageName, message })
      } catch (dbErr) {
        console.error('DB save error:', dbErr)
        // Non-fatal — still try to send email
      }
    }

    // Send email
    if (isEmailConfigured()) {
      await sendContactEmail({ name, email, phone, destination, packageName, message })
    } else {
      console.warn('Email not configured — enquiry saved to DB only')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json(
      { error: 'Failed to send enquiry. Please try WhatsApp or call us directly.' },
      { status: 500 }
    )
  }
}
