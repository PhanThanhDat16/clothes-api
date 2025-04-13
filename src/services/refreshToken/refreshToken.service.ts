import { RefreshToken } from '@/models/refreshToken.model'

export const refreshTokenService = {
  save: async (token: string, username: string) => {
    return await RefreshToken.create({ token, username })
  },

  exists: async (token: string) => {
    return await RefreshToken.findOne({ token })
  },

  delete: async (token: string) => {
    return await RefreshToken.deleteOne({ token })
  },

  deleteAllForUser: async (username: string) => {
    return await RefreshToken.deleteMany({ username })
  }
}
