import { IUser, User } from '@/models/user.model'
import { IUserConstants } from '@/constants/user.constants'

export const userService = {
  registerUser: async (userData: IUser) => {
    const existingUser = await User.findOne({ username: userData.username }).lean()
    if (existingUser) return false

    const newUser = new User({
      ...userData,
      type: 'user',
      email: '',
      totalBill: 0
    })

    await newUser.save()
    const { username, fullName, phone } = newUser
    return { username, fullName, phone }
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
