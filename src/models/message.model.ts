import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    content: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversationId: { type: mongoose.Schema.ObjectId, ref: 'Conversation' },
    isRead: { type: [String], default: [] }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Message = mongoose.model('Message', messageSchema)

export interface IMessage extends Document {
  content: string
  senderId: string
  receiverId: string
  conversationId: string
  isRead: string[]
}
