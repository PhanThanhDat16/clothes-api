import { Order } from '@/models/order.model'
import { IOrderConstants } from '@/constants/order.constants'
import { User } from '@/models/user.model'
interface IFilters {
  search?: string
  status?: string | string[]
}

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

  finAllOrder: async (page = 1, limit = 10, filters: IFilters = {}) => {
    const skip = (page - 1) * limit
    const query: any = {}

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query.status = { $in: filters.status }
      } else {
        const arr = (filters.status as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        query.status = arr.length === 1 ? arr[0] : { $in: arr }
      }
    }

    if (filters.search) {
      const matchedUsers = await User.find({
        fullName: { $regex: filters.search, $options: 'i' }
      })
        .select('_id')
        .lean()

      if (!matchedUsers.length) {
        return {
          orders: [],
          pagination: {
            totalOrders: 0,
            currentPage: page,
            totalPages: 0,
            pageSize: limit
          }
        }
      }

      query.userId = { $in: matchedUsers.map((u) => u._id) }
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ])

    return {
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit) || 0,
        pageSize: limit
      }
    }
  },

  deleteById: async (orderId: string) => {
    return await Order.findByIdAndDelete(orderId)
  },

  countAllOrder: async () => {
    return Order.countDocuments()
  }
}
