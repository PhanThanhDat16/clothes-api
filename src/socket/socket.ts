import { Server } from 'socket.io'
import http from 'http'
import { notificationService } from '@/services/notification/notification.service'
import { userService } from '@/services/user/user.service'

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
    socket.on('join-conversation', (data) => {
      const { conversationId } = data
      console.log(`User joined conversation ${conversationId}`)
      // emit events to admin
      socket.join(conversationId)
      io.to('admin-room').emit('new-conversation', {
        conversationId
      })
    })

    socket.on('join-user', (data) => {
      const { userId } = data
      console.log(`User ${socket.id} joined room ${userId}`)
      socket.join(userId)
    })

    // ADMIN JOIN ROOM
    socket.on('admin-room', () => {
      socket.join('admin-room')
      console.log('🟢Admin joined admin room')
    })

    socket.on('join-admin-conversation', (data) => {
      const { conversationId } = data
      socket.join(conversationId)
      console.log(`🟢 Admin ${socket.id} joined conversation ${conversationId}`)
    })

    // CREATE ORDER - CLIENT
    socket.on('createOrder', async (orderData) => {
      try {
        const listAdmin = await userService.findUserAdmin()

        for (const admin of listAdmin) {
          const adminId = admin._id ? admin._id.toString() : admin.toString()
          const noti = await notificationService.createNoti({
            userId: adminId,
            message: `User ${orderData.userName} just placed an order`,
            isRead: false
          })

          io.to(adminId.toString()).emit('newNotification', noti)
        }
      } catch (err) {
        console.error('error handle createOrder:', err)
      }
    })

    // UPDATE ORDER - ADMIN
    socket.on('updateOrder', async (orderData) => {
      try {
        const noti = await notificationService.createNoti({
          userId: orderData.userId,
          message: `Your order has been changed, please check.`,
          isRead: false
        })

        console.log('hi')

        io.to(orderData.userId).emit('updateOrder', noti)
      } catch (err) {
        console.error('error handle updateOrder:', err)
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
