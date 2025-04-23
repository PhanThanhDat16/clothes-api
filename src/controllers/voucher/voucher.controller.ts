// Libs
import { Request, Response } from 'express'

// Service
import { voucherService } from '@/services/voucher/voucher.service'

import { HttpStatus } from '@/constants/http.constants'
import { voucherValidation } from '@/validations/voucher.validation'

export const voucherController = {
  createVoucher: async (req: Request, res: Response) => {
    const { code, discountPercent } = req.body
    try {
      const validate = voucherValidation.voucherValidate({ code, discountPercent })
      if (Object.keys(validate).length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid input' })
        return
      }

      const existing = await voucherService.findOne(code)
      if (existing) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Voucher code already exists' })
        return
      }

      const voucher = await voucherService.create({ code, discountPercent })

      res.status(HttpStatus.OK).json({ message: 'Voucher created successfully', data: voucher })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal error', error: error })
      return
    }
  },

  getAllVoucher: async (req: Request, res: Response) => {
    try {
      const vouchers = await voucherService.findAll()
      res.status(HttpStatus.OK).json({ data: vouchers })
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal error', error: err })
    }
  },

  updateVoucher: async (req: Request, res: Response) => {
    const voucherId = req.params.id
    const { code, discountPercent } = req.body
    try {
      const validate = voucherValidation.voucherValidate({ code, discountPercent })
      if (Object.keys(validate).length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid input' })
        return
      }

      const updatedVoucher = await voucherService.findAndUpdate(voucherId, { code, discountPercent })
      if (!updatedVoucher) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found' })
        return
      }

      res.status(HttpStatus.OK).json({ message: 'Voucher updated', data: updatedVoucher })
      return
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal error', error: err })
    }
  },

  deleteVoucher: async (req: Request, res: Response) => {
    try {
      const voucherId = req.params.id

      const voucher = await voucherService.findAndDelete(voucherId)
      if (!voucher) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found' })
        return
      }

      res.status(HttpStatus.OK).json({ message: 'Voucher deleted successfully' })
      return
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal error', error: err })
    }
  }
}
