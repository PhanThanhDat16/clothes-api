// Libs
import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'

// Routers
import { routerAuth } from './routers/authAPI.router'
import { routerItem } from './routers/itemAPI.router'
import { routerCategory } from './routers/categoryAPI.router'
import { routerCart } from './routers/cartAPI.router'
import { routerUpload } from './routers/uploadAPI.router'
import { routerOrder } from './routers/orderAPI.router'
import { routerVoucher } from './routers/voucherAPI.router'
import { routerUser } from './routers/userAPI.router'

// config
import connectMongoDB from './config/mongoose.config'

import { setupSocket } from './socket/socket'
import { routerNotification } from './routers/notificationAPI.router'
import { HttpStatus } from './constants/http.constants'

dotenv.config()

// CONNECT TO MONGODB
connectMongoDB()

// CONFIG
const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SETUP SOCKET
setupSocket(server)

// ROUTER
app.use('/api/auth', routerAuth)
app.use('/api/users', routerUser)
app.use('/api/items', routerItem)
app.use('/api/categories', routerCategory)
app.use('/api/cart', routerCart)
app.use('/api/orders', routerOrder)
app.use('/api/vouchers', routerVoucher)
app.use('/api/notifications', routerNotification)
app.use('/api/upload', routerUpload)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message || 'Internal Server Error'
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
