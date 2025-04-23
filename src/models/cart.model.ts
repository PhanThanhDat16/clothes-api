import mongoose, { Document } from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Cart = mongoose.model('Cart', cartSchema, 'carts')

export interface ICart extends Document {
  userId?: string
}
