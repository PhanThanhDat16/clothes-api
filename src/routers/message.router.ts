import { messageController } from '@/controllers/message/message.controller'
import { Router } from 'express'

const router = Router()

router.post('/', messageController.createMessage)
router.get('/:conversationId', messageController.getMessagesByConversation)
router.patch('/:messageId/read', messageController.markAsRead)

export const routerMessage = router
