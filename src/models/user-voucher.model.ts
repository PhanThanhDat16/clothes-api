import mongoose, { Document } from 'mongoose'

const userVoucherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', require: true },
    used: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const UserVoucher = mongoose.model('UserVoucher', userVoucherSchema)

export interface IUserVoucher extends Document {
  userId?: string
  voucherId?: string
  used?: boolean
}
