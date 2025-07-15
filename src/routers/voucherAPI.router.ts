import express from 'express'
import { voucherController } from '@/controllers/voucher/voucher.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, voucherController.createVoucher)
router.get('/', requireAuth, voucherController.getAllVoucher)
router.put('/:id', requireAuth, voucherController.updateVoucher)
router.delete('/:id', requireAuth, voucherController.deleteVoucher)

export const routerVoucher = router
