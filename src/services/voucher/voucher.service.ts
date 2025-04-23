import { Voucher } from '@/models/voucher.model'
import { IVoucherConstants } from '@/constants/voucher.constants'

export const voucherService = {
  create: async (data: IVoucherConstants) => {
    const voucher = new Voucher({ code: data.code, discountPercent: data.discountPercent })
    await voucher.save()
    return voucher
  },

  findOne: async (voucherCode: string) => {
    const voucher = await Voucher.findOne({ code: voucherCode })
    if (!voucher) {
      return false
    }
    return voucher
  },

  findById: async (voucherId: string) => {
    return await Voucher.findById(voucherId).lean()
  },

  findAll: async () => {
    return await Voucher.find().sort({ createdAt: -1 }).lean()
  },

  findAndDelete: async (id: string) => {
    const voucher = await Voucher.findByIdAndDelete(id)
    return voucher
  },

  findAndUpdate: async (id: string, data: IVoucherConstants) => {
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    return updatedVoucher
  }
}
