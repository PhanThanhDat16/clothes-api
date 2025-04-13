import { ItemSize } from '@/models/item-size.model'
import { EStatusItemSize } from '@/constants/item.constants'

export const itemSizeService = {
  createMultiple: async (itemId: string, options: { size: string; stockQuantity: number }[]) => {
    if (!Array.isArray(options)) return

    const docs = options.map((opt) => ({
      itemId,
      size: opt.size,
      stockQuantity: opt.stockQuantity
    }))

    await ItemSize.insertMany(docs)
  },

  findOne: async (itemId: string, size: EStatusItemSize) => {
    const itemSize = await ItemSize.findOne({ itemId, size }).lean()
    return itemSize
  },

  update: async (itemId: string, size: string, data: { stockQuantity: number }) => {
    return await ItemSize.findOneAndUpdate({ itemId, size }, data, { new: true }).lean()
  },

  create: async (itemId: string, size: string, stockQuantity: number) => {
    const newItemSize = new ItemSize({
      itemId,
      size,
      stockQuantity
    })
    return await newItemSize.save()
  },

  findByItemId: async (itemId: string) => {
    return await ItemSize.find({ itemId }).lean()
  },

  findAndUpdate: async (itemId: string, size: string, quantity: number) => {
    await ItemSize.findOneAndUpdate({ itemId, size }, { $inc: { stockQuantity: quantity } })
  }
}
