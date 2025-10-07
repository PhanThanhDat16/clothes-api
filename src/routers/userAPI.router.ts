import express from 'express'
import { userController } from '@/controllers/user/user.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.get('/', requireAuth, userController.getAllUser)
router.get('/profile', requireAuth, userController.profile)
// router.put('/change/password', requireAuth, userController.changePassword)
router.get('/:id', requireAuth, userController.getUserDetail)
router.post('/register', userController.register)
router.put('/:id', requireAuth, userController.update)

// check login google
router.get('/current', requireAuth, userController.currentUser)
router.delete('/:id', requireAuth, userController.deleteUser)

export const routerUser = router
