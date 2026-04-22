import mongoose, { Schema, Document, Model } from 'mongoose'

export type MediaType = 'instagram_post' | 'instagram_reel' | 'uploaded_image' | 'uploaded_video'

export interface IMedia extends Document {
  type: MediaType
  url: string
  thumbnailUrl: string
  caption: string
  instagramUrl?: string
  cloudinaryPublicId?: string
  published: boolean
  order: number
  createdAt: Date
}

const MediaSchema = new Schema<IMedia>(
  {
    type: {
      type: String,
      enum: ['instagram_post', 'instagram_reel', 'uploaded_image', 'uploaded_video'],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    instagramUrl: { type: String },
    cloudinaryPublicId: { type: String },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const MediaModel: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema)

export default MediaModel
