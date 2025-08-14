import { Cart } from '@/models/cart.model'

export const cartService = {
  findOne: async (userId: string) => {
    const cart = await Cart.findOne({ userId }).lean()
    return cart
  },

  create: async (userId: string) => {
    const cart = new Cart({ userId })
    return await cart.save()
  }
}
