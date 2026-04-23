import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <h1 className="font-serif text-4xl text-obsidian mb-8">Terms of Service</h1>
      <div className="text-obsidian/70 space-y-6">
        <p className="text-obsidian/50 text-sm">Last updated: January 2025</p>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">1. Enquiries</h2>
          <p>Submitting an enquiry through our website does not constitute a booking. A booking is only confirmed once you have received a written confirmation from {SITE_NAME} and paid any required deposit.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">2. Pricing</h2>
          <p>All prices are displayed in GBP (£) per person and are subject to availability and change. Final pricing will be confirmed at the time of booking.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">3. ATOL Protection</h2>
          <p>Where applicable, holidays including flights are ATOL protected. Your ATOL certificate will be provided at the time of booking.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">4. Cancellations</h2>
          <p>Cancellation terms vary by package and supplier. Full terms will be provided in your booking documentation.</p>
        </section>
      </div>
    </div>
  )
}
