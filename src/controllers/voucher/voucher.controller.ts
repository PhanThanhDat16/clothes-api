// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Service
import { voucherService } from '@/services/voucher/voucher.service'

import { HttpStatus } from '@/constants/http.constants'
import { voucherValidation } from '@/validations/voucher.validation'

export const voucherController = {
  createVoucher: asyncHandler(async (req: Request, res: Response) => {
    const { code, discountPercent } = req.body
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
  }),

  getAllVoucher: asyncHandler(async (req: Request, res: Response) => {
    const vouchers = await voucherService.findAll()
    res.status(HttpStatus.OK).json({ message: 'Get all voucher successfully', data: vouchers })
  }),

  updateVoucher: asyncHandler(async (req: Request, res: Response) => {
    const voucherId = req.params.id
    const { code, discountPercent } = req.body

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
  }),

  deleteVoucher: asyncHandler(async (req: Request, res: Response) => {
    const voucherId = req.params.id

    const voucher = await voucherService.findAndDelete(voucherId)
    if (!voucher) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Voucher deleted successfully', data: voucher })
  })
}
