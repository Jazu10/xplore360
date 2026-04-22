import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI ? '✅ set' : '❌ missing',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ missing',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ? `✅ "${process.env.ADMIN_USERNAME}"` : '❌ missing',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ set (hidden)' : '❌ missing',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
    EMAIL_USER: process.env.EMAIL_USER ? '✅ set' : '❌ missing',
    NODE_ENV: process.env.NODE_ENV,
  })
}
