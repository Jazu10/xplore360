import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  accommodation?: string
}

export interface IPackage extends Document {
  slug: string
  title: string
  subtitle: string
  destination: string
  duration: string
  durationDays: number
  price: number
  originalPrice?: number
  currency: string
  category: string
  tags: string[]
  heroImage: string
  gallery: string[]
  overview: string
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: IItineraryDay[]
  instagramVideos: string[]
  featured: boolean
  popular: boolean
  published: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

const ItineraryDaySchema = new Schema<IItineraryDay>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  meals: { type: String },
  accommodation: { type: String },
})

const PackageSchema = new Schema<IPackage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    durationDays: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'GBP' },
    category: { type: String, required: true },
    tags: [{ type: String }],
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    overview: { type: String, required: true },
    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    instagramVideos: [{ type: String }],
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

PackageSchema.index({ destination: 1, category: 1, featured: 1, published: 1 })

const PackageModel: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema)

export default PackageModel
