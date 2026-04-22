import mongoose, { Schema, Document } from 'mongoose'

export interface IAdmin extends Document {
  username: string
  passwordHash: string
  email?: string
  role: 'admin' | 'superadmin'
  createdAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    email: { type: String, trim: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  },
  { timestamps: true }
)

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)
