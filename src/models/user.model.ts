// Libs
import mongoose, { Document } from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    password: { type: String, require: true, maxlength: 255 },
    email: { type: String, unique: true, maxlength: 100 },
    fullName: { type: String, require: true, maxlength: 100 },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, maxlength: 15 },
    totalBill: { type: Number, default: 0 }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

userSchema.index({ email: 1 })

export const User = mongoose.model('User', userSchema)
export interface IUser extends Document {
  password: string
  email?: string
  fullName: string
  phone?: string
  type?: 'user' | 'admin'
  totalBill?: number
}

export interface IUserRegister {
  password: string
  email: string
  fullName: string
  phone: string
  type: 'user' | 'admin'
  totalBill?: number
}
