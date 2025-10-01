import express from 'express'
import { categoryController } from '@/controllers/category/category.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, categoryController.createCategory)
router.get('/all', categoryController.getAllCategoryAll)
router.get('/:id', categoryController.getCategoryDetail)
router.get('/', categoryController.getAllCategory)
router.delete('/:id', requireAuth, categoryController.deleteCategory)
router.put('/:id', requireAuth, categoryController.updateCategory)

export const routerCategory = router
