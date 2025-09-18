// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Service
import { itemService } from '@/services/item/item.service'
import { itemSizeService } from '@/services/item/itemSize.service'
import { orderService } from '@/services/order/order.service'
import { orderItemService } from '@/services/order/orderItem.service'
import { userService } from '@/services/user/user.service'
import { userVoucherService } from '@/services/voucher/userVoucher.service'
import { voucherService } from '@/services/voucher/voucher.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'
import { IOrderConstants, IOrderItemConstants, IOrderItemRequestConstants } from '@/constants/order.constants'

import { Order } from '@/models/order.model'

export const orderController = {
  createOrder: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const { userId, items, voucherCode } = data

    let totalPrice = 0
    const orderItems: IOrderItemConstants[] = []

    const itemPromises = items.map(async (item: IOrderItemRequestConstants) => {
      const itemDoc = await itemService.findById(item.itemId)
      if (!itemDoc) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: `Item with ID ${item.itemId} does not exist` })
        return
      }

      const itemSize = await itemSizeService.findOne(item.itemId, item.size)
      if (!itemSize) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: `Size ${item.size} of item does not exist` })
        return
      }

      if (itemSize.stockQuantity < item.quantity) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: `The inventory quantity of item ${item.itemId} size ${item.size} is insufficient`
        })
        return
      }

      totalPrice += item.quantity * (itemDoc.price as number)

      orderItems.push({
        orderId: '',
        itemId: item.itemId,
        size: item.size,
        quantity: item.quantity,
        price: itemDoc.price || 0
      })

      // update stock
      await itemSizeService.updateStock(
        {
          itemId: item.itemId,
          size: item.size,
          quantity: item.quantity
        },
        'plus'
      )
    })

    await Promise.all(itemPromises)

    let finalTotal = totalPrice
    let discount = 0
    let voucherId = null

    if (voucherCode) {
      const voucher = await voucherService.findOne(voucherCode)
      if (voucher) {
        const usedVoucher = await userVoucherService.findOne(userId, voucher._id.toString())
        if (usedVoucher) {
          res.status(HttpStatus.BAD_REQUEST).json({ message: 'Voucher has been used' })
          return
        }
        discount = (totalPrice * (voucher.discountPercent as number)) / 100
        finalTotal -= discount
        voucherId = voucher._id.toString()
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Voucher is invalid' })
        return
      }
    }

    const order = await orderService.createOrder({
      userId,
      totalPrice,
      finalTotal,
      voucherId,
      discount,
      status: 'pending'
    } as IOrderConstants)

    const orderItemPromises = orderItems.map(async (orderItem) => {
      await orderItemService.createOrderItem({
        orderId: order._id.toString(),
        itemId: orderItem.itemId,
        size: orderItem.size,
        quantity: orderItem.quantity,
        price: orderItem.price
      })
    })

    await Promise.all(orderItemPromises)

    if (voucherId) {
      await userVoucherService.updateVoucher(userId, voucherId)
    }

    res.status(HttpStatus.OK).json({
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        finalTotal
      }
    })
  }),

  updateOrder: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const orderId = req.params.id
    const { status } = data
    const validStatuses = ['pending', 'confirmed', 'paid']
    if (!validStatuses.includes(status)) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid status' })
      return
    }

    const order = await orderService.findById(orderId)
    if (!order) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'order not found' })
      return
    }

    if ((order.status === 'confirmed' || order.status === 'paid') && status === 'pending') {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Cannot change state'
      })
      return
    }
    const isBecomingPaid = order.status !== 'paid' && status === 'paid'

    order.status = status
    const orderResult = await order.save()

    if (isBecomingPaid) {
      userService.updateTotalBill(order.userId?.toString() ?? '')
    }

    res.status(HttpStatus.OK).json({
      message: 'Order status has been updated',
      data: orderResult
    })
  }),

  getOrderDetail: asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id
    const order = await Order.findById(orderId)
      .populate('userId', 'name email fullName')
      .populate('voucherId', 'code discount')
    if (!order) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Order does not exist' })
      return
    }

    const orderItems = await orderItemService.findItems(orderId)
    const detailedItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        const itemDetail = orderItem.itemId ? await itemService.findById(orderItem.itemId.toString()) : null
        return {
          ...orderItem.toObject(),
          itemDetail
        }
      })
    )

    const user = order?.userId as unknown as { _id: string; name: string; email: string; fullName: string }
    const voucher =
      order.voucherId === null ? 0 : (order.voucherId as unknown as { _id: string; code: string; discount: number })

    const discount = voucher !== 0 ? voucher.discount : 0
    const totalPrice = order.totalPrice || 0
    const finalTotal = Math.round(totalPrice - (totalPrice * discount) / 100)

    const fullOrder = {
      ...order.toObject(),
      userId: order.userId?._id,
      name: user.name,
      email: user.email,
      fullName: user.fullName,
      voucherId: order.voucherId?._id || null,
      code: voucher !== 0 ? voucher.code : 0,
      discount,
      totalPrice,
      finalTotal,
      items: detailedItems
    }

    res.status(HttpStatus.OK).json({
      message: 'Get order detail successfully',
      data: fullOrder
    })
  }),

  getAllOrder: asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderService.finAllOrder()
    const result = await Promise.all(
      orders.map(async (order) => {
        const user = order?.userId ? await userService.getUserById(order.userId.toString()) : null
        const voucher = order?.voucherId ? await voucherService.findById(order.voucherId.toString()) : null
        const orderItems = await orderItemService.findItemsLean(order._id.toString())

        const detailedItems = await Promise.all(
          orderItems.map(async (oi) => {
            const item = await itemService.findById(oi.itemId?.toString() ?? '')
            return {
              _id: oi._id,
              itemId: {
                _id: item?._id,
                name: item?.name,
                description: item?.description,
                price: item?.price,
                images: item?.images,
                categoryId: item?.categoryId
              },
              size: oi.size,
              quantity: oi.quantity,
              price: oi.price,
              createdAt: oi.createdAt,
              updatedAt: oi.updatedAt
            }
          })
        )

        return {
          _id: order._id,
          userId: user && typeof user !== 'boolean' ? user._id : undefined,
          fullName: user ? user.fullName : undefined,
          email: user && typeof user !== 'boolean' ? user.email : undefined,
          totalPrice: order.totalPrice,
          finalTotal: order.finalTotal,
          status: order.status,
          voucherId: voucher?._id,
          code: voucher?.code,
          discountPercent: voucher?.discountPercent,
          discount: order.discount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          orderItems: detailedItems
        }
      })
    )

    res.status(HttpStatus.OK).json({ message: 'Get all order successfully', data: result })
  }),

  deleteOrder: asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id

    const order = await orderService.findById(orderId)
    if (!order) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Order does not exist' })
      return
    }

    const orderItems = await orderItemService.findItems(orderId)

    await Promise.all(
      orderItems.map((item) => {
        if (item.itemId) {
          return itemSizeService.findAndUpdate(item.itemId.toString(), item.size, item.quantity as number)
        }
        throw new Error('itemId is undefined')
      })
    )
    await orderItemService.deleteItemsByOrderId(orderId)
    const result = await orderService.deleteById(orderId)
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'deleted successfully',
      data: result
    })
  })
}

// export const getAllOrders = async (req: Request, res: Response) => {
//   const { page = 1, limit = 10, status, userId } = req.query

//   const query: any = {}
//   if (status) query.status = status
//   if (userId) query.userId = userId

//   try {
//     const totalOrders = await Order.countDocuments(query)
//     const orders = await Order.find(query)
//       .populate('userId', 'fullName email') // chỉ lấy các field cần
//       .populate('voucherId', 'code discount')
//       .sort({ createdAt: -1 })
//       .skip((+page - 1) * +limit)
//       .limit(+limit)

//     const ordersWithItems = await Promise.all(
//       orders.map(async (order) => {
//         const orderItems = await OrderItem.find({ orderId: order._id }).populate('itemId')
//         return {
//           ...order.toObject(),
//           orderItems
//         }
//       })
//     )

//     res.status(200).json({
//       total: totalOrders,
//       currentPage: +page,
//       pageSize: +limit,
//       orders: ordersWithItems
//     })
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error })
//   }
// }
