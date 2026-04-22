import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <h1 className="font-serif text-4xl text-obsidian mb-8">Privacy Policy</h1>
      <div className="prose prose-lg text-obsidian/70 space-y-6">
        <p className="text-obsidian/50 text-sm">Last updated: January 2025</p>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">1. Who We Are</h2>
          <p>Raniya Travel (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a travel agency based in London, United Kingdom. We are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">2. Data We Collect</h2>
          <p>We collect data you provide when enquiring about packages: your name, email address, phone number, and travel preferences. We also collect basic analytics data about website usage.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">3. How We Use Your Data</h2>
          <p>We use your data solely to respond to your enquiries and provide travel services. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">4. Your Rights</h2>
          <p>Under UK GDPR, you have the right to access, rectify, erase, or port your data. To exercise these rights, contact us at hello@raniyatravel.co.uk.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-obsidian mt-8 mb-3">5. Cookies</h2>
          <p>We use essential cookies for website functionality and optional analytics cookies. You can manage your cookie preferences via the banner displayed on your first visit.</p>
        </section>
      </div>
    </div>
  )
}
