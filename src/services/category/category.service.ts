import { Category } from '@/models/category.model'
import { ICategoryConstants } from '@/constants/category.constants'

export const categoryService = {
  create: async (data: ICategoryConstants) => {
    const existingCategory = await Category.findOne({ name: data.name }).lean()
    if (existingCategory) return false
    return await Category.create(data)
  },

  getCategoryById: async (categoryId: string) => {
    const category = await Category.findById(categoryId).lean()
    if (!category) return false
    return category
  },

  deleteCategory: async (categoryId: string) => {
    const category = await Category.findByIdAndDelete(categoryId)
    return !!category
  },

  updateCategory: async (categoryId: string, data: ICategoryConstants) => {
    return await Category.findByIdAndUpdate(categoryId, data, { new: true })
  },

  findCategoryId: async (categoryId: string) => {
    return await Category.findById(categoryId).lean()
  },

  getAll: async () => {
    const categories = await Category.find()
    return categories
  }
}
