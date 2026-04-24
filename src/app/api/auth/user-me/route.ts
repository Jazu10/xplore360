import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json(null)
  return NextResponse.json(user)
}
