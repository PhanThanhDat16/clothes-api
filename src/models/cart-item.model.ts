import mongoose, { Document } from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const CartItem = mongoose.model('CartItem', cartItemSchema, 'cartItems')

export interface ICartItem extends Document {
  cartId?: string
  itemId?: string
  size?: string
  quantity?: number
}
