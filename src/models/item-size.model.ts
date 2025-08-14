// Libs
import mongoose, { Document } from 'mongoose'

import { EStatusItemSize } from '@/constants/item.constants'

const itemSizeSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', require: true },
    size: { type: String, require: true, enum: ['M', 'L', 'XL'], default: 'M' },
    stockQuantity: { type: Number, default: 0 }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

itemSizeSchema.index({ itemId: 1, size: 1 }, { unique: true })

export const ItemSize = mongoose.model('ItemSize', itemSizeSchema)

export interface IItemSize extends Document {
  itemId?: string
  size?: EStatusItemSize
  stockQuantity?: number
}
