import { Conversation } from '@/models/conversation.model'
import { getIO } from '@/socket/socket'

export const conversationService = {
  createConversation: async (userId: string) => {
    const existing = await Conversation.findOne({ userId })

    // const io = getIO()
    if (existing) {
      return existing
    }
    const conversation = new Conversation({ userId })
    return await conversation.save()
  },

  getAllConversations: async () => {
    return await Conversation.find().populate('userId', 'fullName avatar email').sort({ updatedAt: -1 })
  },

  findByUserId: async (userId: string) => {
    return await Conversation.findOne({ userId }).lean()
  },

  getConversationById: async (id: string) => {
    return await Conversation.findById(id).populate('userId', 'fullName avatar email').lean()
  }
}
