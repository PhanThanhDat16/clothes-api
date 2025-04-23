import express from 'express'
import { cartController } from '@/controllers/cart/cart.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/:id', requireAuth, cartController.addProductInCart)
router.delete('/delete-item/:id', requireAuth, cartController.deleteProductInCart)
router.get('/list-item/:id', requireAuth, cartController.getItemsInCartByUserId)
router.put('/update-item/:id', requireAuth, cartController.updateProductInCart)

export const routerCart = router
