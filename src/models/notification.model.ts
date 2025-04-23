import mongoose, { Document } from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', require: true },
    message: { type: String, require: true },
    isRead: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Notification = mongoose.model('Notification', notificationSchema)

export interface INotification extends Document {
  userId?: string
  orderId?: string
  message?: string
  isRead?: boolean
}
