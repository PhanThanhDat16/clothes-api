import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpStatus } from '@/constants/http.constants'
import { conversationService } from '@/services/conversation/conversation.service'

export const conversationController = {
  createConversation: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.body
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'userId is required' })
      return
    }

    const conversation = await conversationService.createConversation(userId)
    res.status(HttpStatus.OK).json(conversation)
  }),

  getAllConversations: asyncHandler(async (req: Request, res: Response) => {
    const conversations = await conversationService.getAllConversations()
    res.status(HttpStatus.OK).json(conversations)
  }),

  getConversationById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const conversation = await conversationService.getConversationById(id)
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }
    res.status(HttpStatus.OK).json(conversation)
  })
}
