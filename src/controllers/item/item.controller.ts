// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Services
import { itemService } from '@/services/item/item.service'
import { itemSizeService } from '@/services/item/itemSize.service'
import { orderItemService } from '@/services/order/orderItem.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'

import { itemValidation } from '@/validations/item.validation'

export const itemController = {
  createItem: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const { name, description, price, oldPrice, categoryId, images, options } = data

    const validation = itemValidation.validateCreate({ name, description, price, oldPrice, images })
    if (Object.keys(validation).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', errors: validation })
      return
    }

    const item = await itemService.createItem({ name, description, price, oldPrice, categoryId, images })
    if (!item) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'name already exists' })
      return
    }

    await itemSizeService.createMultiple(item._id.toString(), options)

    res.status(HttpStatus.OK).json({ message: 'create successfully' })
  }),

  getItemDetail: asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.id
    const item = await itemService.getItemDetailWithOptions(itemId)

    if (!item) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Item not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Get item detail successfully', data: item })
  }),

  getAllItem: asyncHandler(async (req: Request, res: Response) => {
    const items = await itemService.getAllItemsWithOptions()

    const response = items.map((item) => ({ item }))

    res.status(HttpStatus.OK).json({ message: 'Get all item successfully', data: response })
  }),

  deleteItem: asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.id
    const item = await itemService.findById(itemId)
    if (!item) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Item not found' })
      return
    }
    const itemDelete = await itemService.deleteById(itemId)

    res.status(HttpStatus.OK).json({ message: 'Item deleted successfully', data: itemDelete })
  }),

  getAllItemByCategoryId: asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id
    const items = await itemService.findByCategoryId(categoryId)

    if (!items) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Category not found' })
      return
    }

    const itemsWithOptions = await Promise.all(
      items.map(async (item) => {
        const options = await itemSizeService.findByItemId(item._id.toString())
        return {
          ...item,
          options: options.map((opt) => ({
            size: opt.size,
            stockQuantity: opt.stockQuantity
          }))
        }
      })
    )

    res.status(HttpStatus.OK).json({ message: 'Get all item successfully', data: itemsWithOptions })
  }),

  updateItem: asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.id
    const data = req.body
    const { name, description, price, oldPrice, categoryId, images, options } = data

    const validation = itemValidation.validateCreate({ name, description, price, oldPrice, images })
    if (Object.keys(validation).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', errors: validation })
      return
    }

    const item = await itemService.findById(itemId)
    if (!item) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Item not found' })
      return
    }

    await itemService.updateById(itemId, {
      name,
      description,
      price,
      oldPrice,
      categoryId,
      images
    })

    for (const option of options) {
      const { size, stockQuantity } = option

      const existingSize = await itemSizeService.findOne(itemId, size)
      if (existingSize) {
        await itemSizeService.update(itemId, size, { stockQuantity })
      } else {
        await itemSizeService.create(itemId, size, stockQuantity)
      }
    }

    const updatedItem = await itemService.findById(itemId)
    const updatedOptions = await itemSizeService.findByItemId(itemId)

    if (!updatedItem) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Updated item not found' })
      return
    }

    const responseData = {
      ...updatedItem,
      options: updatedOptions.map((opt) => ({
        size: opt.size,
        stockQuantity: opt.stockQuantity
      }))
    }

    res.status(HttpStatus.OK).json({ message: 'Item updated successfully', data: responseData })
  }),

  getItemTopPopular: asyncHandler(async (req: Request, res: Response) => {
    const result = await orderItemService.orderItemAggregate()
    res.status(HttpStatus.OK).json({ success: 'Get item popular successfully', data: result })
  })
}
