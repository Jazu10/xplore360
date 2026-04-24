import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
export const USER_COOKIE = 'xplore360_user_token'

export interface UserPayload {
  userId: string
  email: string
  name: string
}

export function signUserToken(payload: UserPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' })
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, SECRET) as UserPayload
  } catch {
    return null
  }
}

export function getUserFromRequest(req: NextRequest): UserPayload | null {
  const token = req.cookies.get(USER_COOKIE)?.value
  if (!token) return null
  return verifyUserToken(token)
}

export function createUserCookie(token: string) {
  return {
    name: USER_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  }
}

export function clearUserCookie() {
  return {
    name: USER_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}
