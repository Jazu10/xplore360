import mongoose, { Schema, Document, Model } from 'mongoose'

export type InquiryStatus = 'new' | 'read' | 'replied'

export interface IInquiry extends Document {
  name: string
  email: string
  phone?: string
  destination?: string
  packageName?: string
  message: string
  status: InquiryStatus
  createdAt: Date
  updatedAt: Date
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    destination: { type: String },
    packageName: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }
)

const InquiryModel: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema)

export default InquiryModel
