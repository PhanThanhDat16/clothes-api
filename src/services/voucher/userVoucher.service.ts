import { UserVoucher } from '@/models/user-voucher.model'

export const userVoucherService = {
  findOne: async (userId: string, voucherId: string) => {
    const userVoucher = await UserVoucher.findOne({ userId, voucherId, used: true })
    if (!userVoucher) {
      return false
    }
    return true
  },

  updateVoucher: async (userId: string, voucherId: string) => {
    const userVoucher = await UserVoucher.findOneAndUpdate(
      { userId, voucherId },
      { $set: { used: true } },
      { new: true }
    )
    if (!userVoucher) {
      return false
    }
    return true
  }
}
