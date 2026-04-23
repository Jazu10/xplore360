import PackageModel from '@/models/Package'
import TestimonialModel from '@/models/Testimonial'
import SettingsModel from '@/models/Settings'
import AdminModel from '@/models/Admin'
import { hashPassword } from '@/lib/auth'
import packagesJson from '@/data/packages.json'
import testimonialsJson from '@/data/testimonials.json'
import configJson from '@/data/config.json'

export async function seedIfEmpty() {
  try {
    // Only seed content on a genuinely fresh install (no settings = first ever run)
    const settingsCount = await SettingsModel.countDocuments()
    const isFreshInstall = settingsCount === 0

    if (isFreshInstall) {
      const pkgCount = await PackageModel.countDocuments()
      if (pkgCount === 0) {
        await PackageModel.insertMany(packagesJson as unknown[])
        console.log('✅ Seeded packages from JSON')
      }

      const testimonialCount = await TestimonialModel.countDocuments()
      if (testimonialCount === 0) {
        const mapped = testimonialsJson.map((t) => ({
          name: t.name,
          location: t.location,
          avatar: t.avatar,
          rating: t.rating,
          text: t.text,
          packageName: t.package,
          date: t.date,
          published: true,
        }))
        await TestimonialModel.insertMany(mapped)
        console.log('✅ Seeded testimonials from JSON')
      }
    }

    if (settingsCount === 0) {
      await SettingsModel.create({
        siteName: configJson.siteName,
        tagline: configJson.tagline,
        logoUrl: '',
        whatsapp: configJson.whatsapp,
        phone: configJson.phone,
        email: configJson.email,
        address: configJson.address,
        socialMedia: configJson.socialMedia,
      })
      console.log('✅ Seeded settings from JSON')
    }

    const adminCount = await AdminModel.countDocuments()
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin'
      const password = process.env.ADMIN_PASSWORD || 'changeme'
      await AdminModel.create({
        username,
        passwordHash: await hashPassword(password),
        role: 'superadmin',
      })
      console.log(`✅ Seeded first admin: ${username}`)
    }
  } catch (err) {
    console.error('Seed error:', err)
  }
}
