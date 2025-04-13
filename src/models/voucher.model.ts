import mongoose, { Document } from 'mongoose'

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, require: true, maxlength: 50 },
    discountPercent: { type: Number, require: true }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Voucher = mongoose.model('Voucher', voucherSchema)

export interface IVoucher extends Document {
  code?: string
  discountPercent?: number
}
