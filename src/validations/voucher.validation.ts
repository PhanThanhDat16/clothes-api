import { IVoucherConstants } from '@/constants/voucher.constants'

export const voucherValidation = {
  voucherValidate: (data: IVoucherConstants) => {
    const errors: {
      code?: string
      discountPercent?: string
    } = {}

    if (!data.code || data.code.trim() === '') {
      errors.code = 'Code is required'
    }

    if (!isNaN(Number(data.discountPercent))) {
      errors.discountPercent = 'discount is number'
    }

    return errors
  }
}
