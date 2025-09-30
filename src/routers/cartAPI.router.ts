import express from 'express'
import { cartController } from '@/controllers/cart/cart.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.get('/:id', requireAuth, cartController.getItemsInCartByUserId)
// <<<<<<< feature/develop-order
// =======
// // router.post('/', requireAuth, cartController.addProductInCart)
// >>>>>>> develop
router.post('/:id', requireAuth, cartController.addProductInCart)
router.put('/:id', requireAuth, cartController.updateProductInCart)
router.delete('/:id', requireAuth, cartController.deleteProductInCart)

export const routerCart = router
