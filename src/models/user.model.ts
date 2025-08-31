// Libs
import mongoose, { Document } from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    email: { type: String, unique: true, maxlength: 100 },
    password: { type: String, require: true, maxlength: 255 },
    fullName: { type: String, require: true, maxlength: 100 },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, default: 'local' },
    googleId: { type: String, default: '' },
    phone: { type: String, maxlength: 15 },
    totalBill: { type: Number, default: 0 }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const User = mongoose.model('User', userSchema)
export interface IUser extends Document {
  avatar?: string
  password: string
  email?: string
  fullName: string
  phone?: string
  type?: 'user' | 'admin'
  totalBill?: number
  provider?: string
  googleId?: string
}

export interface IUserRegister {
  avatar?: string
  password: string
  email: string
  fullName: string
  phone: string
  type: 'user' | 'admin'
  totalBill?: number
  provider?: string
  googleId?: string
}
