import express from 'express'
import { categoryController } from '@/controllers/category/category.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, categoryController.createCategory)
router.get('/:id', requireAuth, categoryController.getCategoryDetail)
router.get('/', requireAuth, categoryController.getAllCategory)
router.delete('/:id', requireAuth, categoryController.deleteCategory)
router.put('/:id', requireAuth, categoryController.updateCategory)

export const routerCategory = router
