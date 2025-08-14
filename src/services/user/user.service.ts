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

  getAll: async () => {
    return await User.find().select('-password').lean()
  }
}
