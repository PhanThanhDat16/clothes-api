import { Server } from 'socket.io'
import http from 'http'
import { notificationService } from '@/services/notification/notification.service'

let io: Server

export const setupSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('🟢 A user connected:', socket.id)

    // USER JOIN ROOM
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(conversationId)
      console.log(`User joined conversation ${conversationId}`)
    })

    // ADMIN JOIN ROOM
    socket.on('join-admin', (conversationIds: string[]) => {
      socket.join('admin')
      console.log('Admin joined admin room')

      conversationIds.forEach((id) => {
        socket.join(id)
        console.log(`Admin joined conversation ${id}`)
      })
    })

    // socket.on('newConversation', ({ conversationId }) => {
    //   socket.emit('join-conversation', conversationId)
    // })

    // CREATE ORDER - CLIENT
    socket.on('createOrder', async (orderData) => {
      try {
        const noti = await notificationService.createNoti({
          userId: orderData.userId,
          orderId: orderData.orderId,
          message: `User ${orderData.userName} just placed an order`,
          isRead: false
        })

        io.to('admin').emit('newNotification', noti)
      } catch (err) {
        console.error('❌ error handle createOrder:', err)
      }
    })

    // UPDATE ORDER - ADMIN
    socket.on('updateOrder', async (orderData) => {
      try {
        const noti = await notificationService.createNoti({
          userId: orderData.userId,
          orderId: orderData.orderId,
          message: `Your order has been changed, please check.`,
          isRead: false
        })

        io.to(orderData.userId).emit('updateOrder', noti)
      } catch (err) {
        console.error('❌ error handle updateOrder:', err)
      }
    })

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id)
    })
  })
}

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized')
  }
  return io
}
