import { conversationController } from '@/controllers/conversation/conversation.controller'
import { Router } from 'express'

const router = Router()

router.post('/', conversationController.createConversation)
router.get('/', conversationController.getAllConversations)
router.get('/:id', conversationController.getConversationById)

export const routerConversation = router
