import express from 'express'
import { categoryController } from '@/controllers/category/category.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, categoryController.createCategory)
router.get('/detail/:id', requireAuth, categoryController.getCategoryDetail)
router.get('/all', requireAuth, categoryController.getAllCategory)
router.delete('/delete/:id', requireAuth, categoryController.deleteCategory)
router.put('/update/:id', requireAuth, categoryController.updateCategory)

export const routerCategory = router
