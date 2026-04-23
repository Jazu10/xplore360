import mongoose, { Schema, Document, Model } from 'mongoose'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site-config'

export interface ISettings extends Document {
  siteName: string
  tagline: string
  logoUrl: string
  whatsapp: string
  phone: string
  email: string
  address: string
  socialMedia: {
    instagram: string
    facebook: string
  }
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: SITE_NAME },
    tagline: { type: String, default: SITE_TAGLINE },
    logoUrl: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: 'London, United Kingdom' },
    socialMedia: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

const SettingsModel: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)

export default SettingsModel
