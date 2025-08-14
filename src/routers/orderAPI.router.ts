import express from 'express'
import { orderController } from '@/controllers/order/order.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, orderController.createOrder)
router.get('/:id', requireAuth, orderController.getOrderDetail)
router.get('/', requireAuth, orderController.getAllOrder)
router.put('/:id', requireAuth, orderController.updateOrder)
router.delete('/:id', requireAuth, orderController.deleteOrder)

export const routerOrder = router
