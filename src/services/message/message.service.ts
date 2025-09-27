import { Message } from '@/models/message.model'
import { getIO } from '@/socket/socket'

interface IMessage {
  content: string
  senderId: string
  receiverId: string
  conversationId: string
}

export const messageService = {
  createMessage: async (data: IMessage) => {
    const io = getIO()
    const message = new Message(data)
    const savedMessage = await message.save()
    io.to(data.conversationId).emit('send-message', savedMessage)
    return savedMessage
  },

  getMessagesByConversation: async (conversationId: string) => {
    return await Message.find({ conversationId })
      .populate('senderId', 'fullName avatar email')
      .populate('receiverId', 'fullName avatar email')
      .sort({ createdAt: 1 })
  },

  markAsRead: async (messageId: string, userId: string) => {
    return await Message.findByIdAndUpdate(messageId, { $addToSet: { isRead: userId } }, { new: true })
  }
}
