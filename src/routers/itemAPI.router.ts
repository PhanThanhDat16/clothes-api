import express from 'express'
import { itemController } from '@/controllers/item/item.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'
const router = express.Router()

router.post('/', requireAuth, itemController.createItem)
router.get('/detail/:id', requireAuth, itemController.getItemDetail)
// all item by categoryId
router.get('/all-category/:id', itemController.getAllItemByCategoryId)
// all
router.get('/all', itemController.getAllItem)
router.delete('/delete/:id', requireAuth, itemController.deleteItem)
router.put('/update/:id', requireAuth, itemController.updateItem)
router.get('/top-popular', itemController.getItemTopPopular)

export const routerItem = router
