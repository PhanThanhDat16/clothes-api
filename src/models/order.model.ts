// Libs
import mongoose, { Document } from 'mongoose'

import { EStatusOrder } from '@/constants/order.constants'

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    totalPrice: { type: Number, require: true },
    finalTotal: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'cancelled', 'paid'], default: 'pending' },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: false },
    discount: { type: Number, default: 0 }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Order = mongoose.model('Order', orderSchema)

export interface IOrder extends Document {
  userId?: string
  totalPrice?: number
  finalTotal?: number
  status?: EStatusOrder
  voucherId?: string
  discount?: number
}
