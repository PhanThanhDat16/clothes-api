// Libs
import mongoose, { Document } from 'mongoose'

import { EStatusTypeUser } from '@/constants/user.constants'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true, maxlength: 100 },
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

export const User = mongoose.model('User', userSchema)

export interface IUser extends Document {
  username: string
  password: string
  email?: string
  fullName: string
  phone?: string
  type?: EStatusTypeUser
  totalBill?: number
}
