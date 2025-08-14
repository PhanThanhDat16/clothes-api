import express from 'express'
import { notificationController } from '@/controllers/notification/notification.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.get('/:id', requireAuth, notificationController.getDetail)
router.put('/:id', requireAuth, notificationController.updateStatusNoti)
router.get('/user/:id', requireAuth, notificationController.getNotiListUser)
// router.post('/read-all/:id', requireAuth, notificationController.updateReadAll)
router.post('/read-all', requireAuth, notificationController.updateReadAll)

export const routerNotification = router
