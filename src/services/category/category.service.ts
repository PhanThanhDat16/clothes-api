import { Category } from '@/models/category.model'
import { ICategoryConstants } from '@/constants/category.constants'

export const categoryService = {
  create: async (data: ICategoryConstants) => {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, 'i') }
    }).lean()
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

  getAll: async (page: number, limit: number, search?: string) => {
    const query: any = {}
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' }
    }
    const skip = (page - 1) * limit
    const total = await Category.countDocuments(query)
    const categories = await Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: categories
    }
  },

  getAllCategoryAll: async () => {
    return await Category.find({ status: 'active' }).lean()
  }
}
