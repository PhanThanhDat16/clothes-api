import { Message } from '@/models/message.model'

export const messageService = {
  createMessage: async (data: any) => {
    const message = new Message(data)
    return await message.save()
  },

  getMessagesByConversation: async (conversationId: string) => {
    return await Message.find({ conversationId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 })
  },

  markAsRead: async (messageId: string, userId: string) => {
    return await Message.findByIdAndUpdate(messageId, { $addToSet: { isRead: userId } }, { new: true })
  }
}
