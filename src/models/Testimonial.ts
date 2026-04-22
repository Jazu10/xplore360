import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  packageName: string
  date: string
  published: boolean
  createdAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    packageName: { type: String, required: true },
    date: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export default TestimonialModel
