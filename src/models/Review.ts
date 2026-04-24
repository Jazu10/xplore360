import mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    targetSlug: { type: String, required: true },
    targetType: { type: String, enum: ['package', 'camp'], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    instagramUrl: { type: String },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
