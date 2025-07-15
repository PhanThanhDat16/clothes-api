import express from 'express'
import { itemController } from '@/controllers/item/item.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'
const router = express.Router()

router.post('/', requireAuth, itemController.createItem)
router.get('/:id', requireAuth, itemController.getItemDetail)
router.get('/', itemController.getAllItem)
router.get('/popular', itemController.getItemTopPopular)
router.get('/category/:id', itemController.getAllItemByCategoryId)
router.delete('/:id', requireAuth, itemController.deleteItem)
router.put('/:id', requireAuth, itemController.updateItem)

export const routerItem = router
