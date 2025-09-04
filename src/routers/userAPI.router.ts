import express from 'express'
import { userController } from '@/controllers/user/user.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.get('/',requireAuth, userController.getAllUser)
router.get('/profile', requireAuth, userController.profile)
router.get('/:id', requireAuth, userController.getUserDetail)
router.post('/register', userController.register)
router.put('/:id', requireAuth, userController.update)

router.delete('/:id', requireAuth, userController.deleteUser)
// router.get('/profile/:id', requireAuth, userController.profile)

export const routerUser = router
