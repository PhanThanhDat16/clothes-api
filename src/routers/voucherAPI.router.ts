import express from 'express'
import { voucherController } from '@/controllers/voucher/voucher.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, voucherController.createVoucher)
router.get('/all', requireAuth, voucherController.getAllVoucher)
router.put('/update/:id', requireAuth, voucherController.updateVoucher)
router.delete('/delete/:id', requireAuth, voucherController.deleteVoucher)

export const routerVoucher = router
