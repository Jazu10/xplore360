import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    status: { type: String, enum: ['active', 'blacklisted'], default: 'active' },
    emailVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
