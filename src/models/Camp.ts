import mongoose, { Schema } from 'mongoose'

const CampSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    location: { type: String, required: true },
    duration: { type: String },
    durationDays: { type: Number, default: 1 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'GBP' },
    category: { type: String, default: 'Adventure' },
    tags: [{ type: String }],
    heroImage: { type: String },
    gallery: [{ type: String }],
    overview: { type: String },
    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],
    capacity: { type: Number },
    season: { type: String },
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        meals: String,
        accommodation: String,
      },
    ],
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Camp || mongoose.model('Camp', CampSchema)
