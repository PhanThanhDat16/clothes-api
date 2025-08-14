// Libs
import mongoose, { Document } from 'mongoose'

import { EStatusItemSize } from '@/constants/item.constants'

const orderItemSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', require: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', require: true },
    quantity: { type: Number, require: true },
    price: { type: Number, require: true },
    size: { type: String, require: true, enum: ['M', 'L', 'XL'], default: 'M' }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const OrderItem = mongoose.model('OrderItem', orderItemSchema)

export interface IOrderItem extends Document {
  orderId?: string
  itemId?: string
  quantity?: number
  price?: number
  size?: EStatusItemSize
}
