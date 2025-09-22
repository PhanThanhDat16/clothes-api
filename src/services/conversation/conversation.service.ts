import { Conversation } from '@/models/conversation.model'
import { getIO } from '@/socket/socket'

export const conversationService = {
  createConversation: async (userId: string) => {
    const existing = await Conversation.findOne({ userId })

    const io = getIO()
    if (existing) {
      io.to('admin').emit('newConversation', {
        conversationId: existing._id.toString()
      })
      return existing
    }
    const conversation = new Conversation({ userId })
    io.to('admin').emit('newConversation', {
      conversationId: conversation._id.toString()
    })
    return await conversation.save()
  },

  getAllConversations: async () => {
    return await Conversation.find().sort({ updatedAt: -1 })
  },

  getConversationById: async (id: string) => {
    return await Conversation.findById(id)
  }
}
