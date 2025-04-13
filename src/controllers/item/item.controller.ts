// Libs
import { Request, Response } from 'express'

// Services
import { itemService } from '@/services/item/item.service'
import { itemSizeService } from '@/services/item/itemSize.service'
import { orderItemService } from '@/services/order/orderItem.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'

import { itemValidation } from '@/validations/item.validation'

export const itemController = {
  createItem: async (req: Request, res: Response) => {
    const data = req.body
    const { name, description, price, oldPrice, categoryId, images, options } = data

    try {
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

      res.status(201).json({ message: 'create successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  getItemDetail: async (req: Request, res: Response) => {
    const itemId = req.params.id
    try {
      const item = await itemService.getItemDetailWithOptions(itemId)

      if (!item) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Item not found' })
        return
      }

      res.status(HttpStatus.OK).json({ data: item })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  getAllItem: async (req: Request, res: Response) => {
    try {
      const items = await itemService.getAllItemsWithOptions()

      const response = items.map((item) => ({ item }))

      res.status(HttpStatus.OK).json({ data: response })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  deleteItem: async (req: Request, res: Response) => {
    const itemId = req.params.id
    try {
      const item = await itemService.findById(itemId)
      if (!item) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Item not found' })
        return
      }
      await itemService.deleteById(itemId)

      res.status(HttpStatus.OK).json({ message: 'Item deleted successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  getAllItemByCategoryId: async (req: Request, res: Response) => {
    const categoryId = req.params.id
    try {
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

      res.status(HttpStatus.OK).json({ data: itemsWithOptions })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  updateItem: async (req: Request, res: Response) => {
    const itemId = req.params.id
    try {
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
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  getItemTopPopular: async (req: Request, res: Response) => {
    try {
      const result = await orderItemService.orderItemAggregate()

      res.status(HttpStatus.OK).json({ success: true, data: result })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error', error })
      return
    }
  }
}
