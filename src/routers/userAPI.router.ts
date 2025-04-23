import express from 'express'
import { userController } from '@/controllers/user/user.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/register', userController.register)
router.get('/profile/:id', requireAuth, userController.profile)
router.get('/all', requireAuth, userController.getAllUser)
router.put('/update/:id', requireAuth, userController.update)

export const routerUser = router
