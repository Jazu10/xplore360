import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
const COOKIE_NAME = 'xplore360_admin_token'
const TOKEN_EXPIRY = '7d'

export interface AdminPayload {
  username: string
  role: 'admin' | 'superadmin'
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}

// Returns the role if credentials are valid, null if invalid
export async function verifyAdminCredentials(username: string, password: string): Promise<'admin' | 'superadmin' | null> {
  const { isDBConfigured, connectDB } = await import('@/lib/db')

  if (isDBConfigured()) {
    try {
      await connectDB()
      const AdminModel = (await import('@/models/Admin')).default

      // Auto-seed first admin from env vars if collection is empty
      const count = await AdminModel.countDocuments()
      if (count === 0) {
        const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase()
        const envPass = process.env.ADMIN_PASSWORD || 'changeme'
        await AdminModel.create({
          username: envUser,
          passwordHash: await bcrypt.hash(envPass, 12),
          role: 'superadmin',
        })
      }

      const admin = await AdminModel.findOne({ username: username.toLowerCase() })
      if (admin) {
        const valid = await bcrypt.compare(password, admin.passwordHash)
        return valid ? (admin.role as 'admin' | 'superadmin') : null
      }
    } catch {
      // fall through to env var fallback
    }
  }

  // Fallback: env vars — treated as superadmin
  const valid = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
  return valid ? 'superadmin' : null
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null
}

export function getAdminFromRequest(req: NextRequest): AdminPayload | null {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function createAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME
