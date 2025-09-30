import { CartItem } from '@/models/cart-item.model'
import { EStatusItemSize } from '@/constants/item.constants'
import { Cart } from '@/models/cart.model'

export const cartItemService = {
  findOne: async (cartId: string, itemId: string, size: EStatusItemSize) => {
    return await CartItem.findOne({ cartId, itemId, size }).lean()
  },

  create: async (cartId: string, itemId: string, size: EStatusItemSize, quantity: number) => {
    const cartItem = new CartItem({ cartId, itemId, size, quantity })
    return await cartItem.save()
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    return await CartItem.findByIdAndUpdate(cartItemId, { $inc: { quantity } }, { new: true })
  },

  updateQuantityItemInc: async (cartItemId: string, quantity: number) => {
    return await CartItem.findByIdAndUpdate(cartItemId, { quantity }, { new: true })
  },

  deleteOne: async (cartItemId: string) => {
    return await CartItem.deleteOne({ _id: cartItemId })
  },

  deleteManyByCartId: async (cartItemId: string) => {
    const cartDelete = await Cart.findByIdAndDelete(cartItemId)
    await CartItem.deleteMany({ cartItemId })
    return cartDelete
  },

  find: async (cartId: string) => {
    const cartItems = await CartItem.find({ cartId }).populate('itemId').lean()
    return cartItems
  }
}
