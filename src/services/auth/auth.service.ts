// Libs
import bcrypt from 'bcrypt'

// Models
import { User } from '@/models/user.model'

export const authService = {
  checkLoginAuth: async (username: string, password: string) => {
    const existingUser = await User.findOne({ username }).lean()
    if (!existingUser) return false

    const passwordMatch = await bcrypt.compare(password, existingUser.password as string)
    if (!passwordMatch) return false

    return existingUser
  },

  findOne: async (username: string) => {
    const existingUser = await User.findOne({ username }).lean()
    if (!existingUser) return false

    return existingUser
  }
}
