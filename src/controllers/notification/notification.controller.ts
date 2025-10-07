import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { HttpStatus } from '@/constants/http.constants'
import { notificationService } from '@/services/notification/notification.service'

export const notificationController = {
  createNotification: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const notification = await notificationService.createNoti(data)
    res.status(HttpStatus.OK).json({ message: 'Create notification successfully', data: notification })
  }),

  getDetail: asyncHandler(async (req: Request, res: Response) => {
    const notiId = req.params.id

    const notification = await notificationService.getDetail(notiId)
    if (!notification) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'the notification id not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Get notification detail', data: notification })
  }),

  updateStatusNoti: asyncHandler(async (req: Request, res: Response) => {
    const notiId = req.params.id

    const noti = await notificationService.updateNoti(notiId)
    if (!noti) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'NotificationId not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'updated successfully', data: noti })
  }),

  updateReadAll: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const noti = await notificationService.updateReadAll(userId)
    if (!noti) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'userId not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'updated successfully', data: noti })
  }),

  getNotiListUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const notiList = await notificationService.getListByUser(userId)
    if (!notiList) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'user not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Get notification by user successfully', data: notiList })
  })
}
