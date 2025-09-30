import express from 'express'
import { cartController } from '@/controllers/cart/cart.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.get('/:id', requireAuth, cartController.getItemsInCartByUserId)
router.post('/:id', requireAuth, cartController.addProductInCart)
router.put('/:id', requireAuth, cartController.updateProductInCart)
router.delete('/:id', requireAuth, cartController.deleteProductInCart)
router.delete('/:id/all', requireAuth, cartController.clearCart)

export const routerCart = router
