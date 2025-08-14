import { OrderItem } from '@/models/order-item.model'
import { IOrderItemConstants } from '@/constants/order.constants'

export const orderItemService = {
  createOrderItem: async (data: IOrderItemConstants) => {
    const orderItemDoc = new OrderItem({
      ...data
    })
    await orderItemDoc.save()
  },

  findItems: async (orderId: string) => {
    const orderItems = await OrderItem.find({ orderId })
    return orderItems
  },

  findItemsLean: async (orderId: string) => {
    const orderItems = await OrderItem.find({ orderId }).lean()
    return orderItems
  },

  deleteMany: async (orderId: string) => {
    const orderItem = await OrderItem.deleteMany({ orderId })
    return orderItem
  },

  deleteItemsByOrderId: async (orderId: string) => {
    await OrderItem.deleteMany({ orderId })
  },

  orderItemAggregate: async () => {
    const result = await OrderItem.aggregate([
      {
        $group: {
          _id: '$itemId',
          totalOrders: { $sum: '$quantity' }
        }
      },
      {
        $match: {
          totalOrders: { $gt: 6 }
        }
      },
      {
        $sort: { totalOrders: -1 }
      },
      {
        $limit: 6
      },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      {
        $unwind: '$itemDetails'
      },
      {
        $lookup: {
          from: 'itemsizes',
          localField: '_id',
          foreignField: 'itemId',
          as: 'itemSizes'
        }
      },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          itemName: '$itemDetails.name',
          itemPrice: '$itemDetails.price',
          itemDescription: '$itemDetails.description',
          itemCategoryId: '$itemDetails.categoryId',
          itemImages: '$itemDetails.images',
          options: {
            $map: {
              input: '$itemSizes',
              as: 'size',
              in: {
                itemId: '$_id',
                itemSize: '$$size.size',
                itemStockQuantity: '$$size.stockQuantity'
              }
            }
          }
        }
      }
    ])

    return result
  }
}

// const result = await OrderItem.aggregate([
//   {
//     $group: {
//       _id: '$itemId',
//       totalOrders: { $sum: '$quantity' }
//     }
//   },
//   {
//     $match: {
//       totalOrders: { $gt: 1 }
//     }
//   },
//   {
//     $sort: { totalOrders: -1 }
//   },
//   {
//     $limit: 6
//   },
//   {
//     $lookup: {
//       from: 'items',
//       localField: '_id',
//       foreignField: '_id',
//       as: 'itemDetails'
//     }
//   },
//   {
//     $unwind: '$itemDetails'
//   },
//   {
//     $project: {
//       _id: 1,
//       totalOrders: 1,
//       name: '$itemDetails.name',
//       price: '$itemDetails.price',
//       description: '$itemDetails.description',
//       oldPrice: '$itemDetails.oldPrice',
//       categoryId: '$itemDetails.categoryId',
//       images: '$itemDetails.images'
//     }
//   }
// ])
