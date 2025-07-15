// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Services
import { cartItemService } from '@/services/cart/cartItem.service'
import { cartService } from '@/services/cart/cart.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'
import { IItemConstants } from '@/constants/item.constants'

export const cartController = {
  addProductInCart: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const userId = req.params.id
    const { itemId, size, quantity } = data

    let existingCart = await cartService.findOne(userId)
    if (!existingCart) {
      existingCart = await cartService.create(userId)
    }

    const existingCartItem = await cartItemService.findOne(existingCart._id.toString(), itemId, size)
    if (existingCartItem) {
      const updatedCartItem = await cartItemService.updateQuantity(existingCartItem._id.toString(), quantity)
      res.status(HttpStatus.OK).json({ data: updatedCartItem })
      return
    }

    const newCartItem = await cartItemService.create(existingCart._id.toString(), itemId, size, quantity)

    res.status(HttpStatus.OK).json({ message: 'Item added to cart successfully', data: newCartItem })
  }),

  deleteProductInCart: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const userId = req.params.id
    const { itemId, size } = data
    const existingCart = await cartService.findOne(userId)
    if (!existingCart) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Cart not found for user' })
      return
    }

    const existingCartItem = await cartItemService.findOne(existingCart._id.toString(), itemId, size)
    if (!existingCartItem) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Item with this size not found in cart' })
      return
    }
    await cartItemService.deleteOne(existingCartItem._id.toString())
    res.status(HttpStatus.OK).json({ message: 'Item removed from cart successfully', data: existingCartItem })
  }),

  getItemsInCartByUserId: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const existingCart = await cartService.findOne(userId)
    if (!existingCart) {
      res.status(HttpStatus.OK).json({
        data: []
      })
      return
    }

    const cartItems = await cartItemService.find(existingCart._id.toString())
    const listCartItems = cartItems.map((item) => {
      const itemData = item.itemId as IItemConstants
      return {
        _id: item._id,
        itemId: item.itemId._id,
        cartId: item.cartId,
        size: item.size,
        quantity: item.quantity,
        item: {
          name: itemData.name,
          images: itemData.images?.[0],
          price: itemData.price,
          oldPrice: itemData.oldPrice,
          description: itemData.description,
          categoryId: itemData.categoryId
        }
      }
    })

    res.status(HttpStatus.OK).json({
      message: 'Get item in cart successfully',
      data: listCartItems
    })
  }),

  updateProductInCart: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const userId = req.params.id
    const { itemId, size, quantity } = data
    const existingCart = await cartService.findOne(userId)
    if (!existingCart) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Cart does not exist'
      })
      return
    }

    const existingCartItem = await cartItemService.findOne(existingCart._id.toString(), itemId, size)
    let updatedCartItem
    if (existingCartItem) {
      updatedCartItem = await cartItemService.updateQuantity(existingCartItem._id.toString(), quantity)
    }

    res.status(HttpStatus.OK).json({ message: 'updated successfully', data: updatedCartItem })
  })
}
