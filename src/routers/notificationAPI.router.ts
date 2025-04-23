import express from 'express'
import { notificationController } from '@/controllers/notification/notification.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()
router.get('/detail/:id', requireAuth, notificationController.getDetail)
router.put('/:id', requireAuth, notificationController.updateStatusNoti)
router.post('/read-all/:id', requireAuth, notificationController.updateReadAll)
router.get('/list/user/:id', requireAuth, notificationController.getNotiListUser)

export const routerNotification = router
