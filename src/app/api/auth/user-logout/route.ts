import { NextResponse } from 'next/server'
import { clearUserCookie } from '@/lib/user-auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(clearUserCookie())
  return res
}
