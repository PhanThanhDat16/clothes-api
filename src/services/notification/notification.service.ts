import { INotificationConstants } from '@/constants/notification.constants'
import { Notification } from '@/models/notification.model'

export const notificationService = {
  createNoti: async (data: INotificationConstants) => {
    const noti = await Notification.create({
      userId: data.userId,
      orderId: data.orderId,
      message: data.message,
      isRead: data.isRead
    })
    return noti
  },

  getDetail: async (notiId: string) => {
    const notification = await Notification.findById(notiId).lean()
    if (!notification) return false
    return notification
  },

  updateNoti: async (notiId: string) => {
    const notification = await Notification.findByIdAndUpdate(notiId, { isRead: true }, { new: true }).lean()
    if (!notification) return false
    return notification
  },

  updateReadAll: async (userId: string) => {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true })
    return true
  },

  getListByUser: async (userId: string) => {
    const notifications = await Notification.find({ userId }).sort({ created_at: -1 })
    if (!notifications) return false
    return notifications
  }
}
