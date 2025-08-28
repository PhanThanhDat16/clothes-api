import { IUserRegister, User } from '@/models/user.model'
import { IUserConstants } from '@/constants/user.constants'

export const userService = {
  registerUser: async (userData: IUserRegister) => {
    const existingUser = await User.findOne({ email: userData.email }).lean()
    if (existingUser) return false

    const newUser = new User({
      ...userData,
      totalBill: 0
    })

    await newUser.save()
    const { email, fullName, phone } = newUser
    return { email, fullName, phone }
  },

  getUserById: async (userId: string) => {
    const user = await User.findById(userId).lean()
    if (!user) return false
    return user
  },

  updateUser: async (userId: string, userData: IUserConstants) => {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: userData
      },
      {
        new: true
      }
    )
    if (!updatedUser) return false
    return updatedUser
  },

  updateTotalBill: async (userId: string) => {
    await User.findByIdAndUpdate(userId, {
      $inc: { totalBill: 1 }
    })
  },

  getAll: async (page: number, limit: number, search?: string) => {
    const query: any = {}
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' }
    }
    const skip = (page - 1) * limit
    const total = await User.countDocuments({ ...query, type: { $ne: 'admin' } })
    const categories = await User.find({ ...query, type: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: categories
    }
  },

  delete: async (userId: string) => {
    const user = await User.findByIdAndDelete(userId)
    return !!user
  }
}
