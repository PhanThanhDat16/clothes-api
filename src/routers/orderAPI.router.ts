import express from 'express'
import { orderController } from '@/controllers/order/order.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, orderController.createOrder)
router.get('/detail/:id', requireAuth, orderController.getOrderDetail)
router.get('/all', requireAuth, orderController.getAllOrder)
router.put('/update/:id', requireAuth, orderController.updateOrder)
router.delete('/delete/:id', requireAuth, orderController.deleteOrder)

export const routerOrder = router
