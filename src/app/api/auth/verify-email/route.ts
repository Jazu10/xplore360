import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isDBConfigured } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token)
    return NextResponse.json({ error: 'Token required' }, { status: 400 })

  if (!isDBConfigured())
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    await connectDB()
    const UserModel = (await import('@/models/User')).default

    const user = await UserModel.findOneAndUpdate(
      { verifyToken: token },
      { $set: { emailVerified: true }, $unset: { verifyToken: '' } },
      { new: true, lean: true }
    )

    if (!user)
      return NextResponse.json({ error: 'Invalid or already used verification link' }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
