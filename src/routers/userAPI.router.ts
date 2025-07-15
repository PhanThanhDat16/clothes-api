import express from 'express'
import { userController } from '@/controllers/user/user.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/register', userController.register)
router.get('/', requireAuth, userController.getAllUser)
router.put('/:id', requireAuth, userController.update)
// router.get('/profile/:id', requireAuth, userController.profile)
router.get('/profile', requireAuth, userController.profile)

export const routerUser = router
