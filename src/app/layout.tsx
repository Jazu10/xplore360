import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Premium UK-based travel agency offering curated luxury holidays, honeymoons, and bespoke tour packages worldwide.',
  keywords: ['luxury travel', 'UK travel agency', 'holiday packages', 'bespoke tours'],
  openGraph: { type: 'website', locale: 'en_GB', siteName: SITE_NAME },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: '13px', borderRadius: 0 },
            success: { iconTheme: { primary: '#C9A96E', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
