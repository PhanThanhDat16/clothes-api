// Models
import { ItemSize } from '@/models/item-size.model'
import { Item } from '@/models/item.model'

// Constants
import { EStatusItemSize, IItemModelConstants } from '@/constants/item.constants'
import { categoryService } from '../category/category.service'

export const itemService = {
  createItem: async (data: IItemModelConstants) => {
    const existingItem = await Item.findOne({ name: data.name }).lean()
    if (existingItem) return false

    const item = new Item(data)
    return await item.save()
  },

  findById: async (id: string) => {
    const item = await Item.findById(id).lean()
    return item
  },

  getItemDetailWithOptions: async (itemId: string) => {
    const item = await Item.findById(itemId).lean()
    const sizes = await ItemSize.find({ itemId }).lean()

    const options = sizes.map((option) => ({
      size: option.size as EStatusItemSize,
      stockQuantity: option.stockQuantity
    }))

    return {
      ...item,
      options
    }
  },

  getAllItemsWithOptions: async () => {
    const items = await Item.find().lean()
    const itemIds = items.map((item) => item._id)
    const options = await ItemSize.find({ itemId: { $in: itemIds } }).lean()

    const optionsMap = new Map<string, { size: string; stockQuantity: number }[]>()
    for (const opt of options) {
      if (opt.itemId) {
        const list = optionsMap.get(opt.itemId.toString()) || []
        list.push({ size: opt.size, stockQuantity: opt.stockQuantity })
        optionsMap.set(opt.itemId.toString(), list)
      }
    }

    return items.map((item) => ({
      ...item,
      options: optionsMap.get(item._id.toString()) || []
    }))
  },

  findByCategoryId: async (categoryId: string) => {
    const cate = await categoryService.findCategoryId(categoryId)
    if (!cate) return false
    return await Item.find({ categoryId }).lean()
  },

  deleteById: async (itemId: string) => {
    await Item.findByIdAndDelete(itemId)
    await ItemSize.deleteMany({ itemId })
    return true
  },

  updateById: async (itemId: string, data: IItemModelConstants) => {
    const updatedItem = await Item.findByIdAndUpdate(itemId, { $set: data }, { new: true }).lean()
    return updatedItem
  }
}
