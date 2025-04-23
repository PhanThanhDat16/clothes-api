import { HttpStatus } from '@/constants/http.constants'
import { notificationService } from '@/services/notification/notification.service'
import { Request, Response } from 'express'

export const notificationController = {
  getDetail: async (req: Request, res: Response) => {
    const notiId = req.params.id
    try {
      const notification = await notificationService.getDetail(notiId)
      if (!notification) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'the notification id not found' })
        return
      }

      res.status(HttpStatus.OK).json({ data: notification })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  updateStatusNoti: async (req: Request, res: Response) => {
    const notiId = req.params.id
    try {
      const noti = await notificationService.updateNoti(notiId)
      if (!noti) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'NotificationId not found' })
        return
      }

      res.status(HttpStatus.OK).json({ message: 'updated  successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  updateReadAll: async (req: Request, res: Response) => {
    const userId = req.params.id
    try {
      const noti = await notificationService.updateReadAll(userId)
      if (!noti) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'userId not found' })
        return
      }

      res.status(HttpStatus.OK).json({ message: 'updated  successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  },

  getNotiListUser: async (req: Request, res: Response) => {
    const userId = req.params.id
    try {
      const notiList = await notificationService.getListByUser(userId)
      if (!notiList) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'user not found' })
        return
      }

      res.status(HttpStatus.OK).json({ data: notiList })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error })
      return
    }
  }
}
