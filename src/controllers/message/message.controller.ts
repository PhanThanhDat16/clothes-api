import asyncHandler from 'express-async-handler'
import { HttpStatus } from '@/constants/http.constants'
import { messageService } from '@/services/message/message.service'
import { Request, Response } from 'express'

export const messageController = {
  createMessage: asyncHandler(async (req: Request, res: Response) => {
    const { content, senderId, receiverId, conversationId } = req.body
    if (!content || !senderId || !receiverId || !conversationId) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing required fields' })
      return
    }

    const message = await messageService.createMessage({
      content,
      senderId,
      receiverId,
      conversationId
    })

    res.status(HttpStatus.OK).json(message)
  }),

  getMessagesByConversation: asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params
    const messages = await messageService.getMessagesByConversation(conversationId)
    res.status(HttpStatus.OK).json(messages)
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params
    const { userId } = req.body

    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'userId is required' })
      return
    }

    const updatedMessage = await messageService.markAsRead(messageId, userId)
    if (!updatedMessage) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Message not found' })
      return
    }

    res.status(HttpStatus.OK).json(updatedMessage)
  })
}
