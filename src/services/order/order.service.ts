import { Order } from '@/models/order.model'
import { IOrderConstants } from '@/constants/order.constants'

export const orderService = {
  createOrder: async (data: IOrderConstants) => {
    const order = new Order({
      userId: data.userId,
      totalPrice: data.totalPrice,
      finalTotal: data.finalTotal,
      voucherId: data.voucherId || null,
      discount: data.discount,
      status: data.status
    })
    await order.save()
    return order
  },

  findById: async (orderId: string) => {
    const order = await Order.findById(orderId)
    return order
  },

  finAllOrder: async () => {
    return await Order.find().sort({ createdAt: -1 }).lean()
  },

  deleteById: async (orderId: string) => {
    await Order.findByIdAndDelete(orderId)
  }
}
