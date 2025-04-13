// Libs
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'

// Routers
import { routerAuth } from './routers/authAPI.router'
import { routerUser } from './routers/userAPI.router'
import { routerItem } from './routers/itemAPI.router'
import { routerCategory } from './routers/categoryAPI.router'
import { routerCart } from './routers/cartAPI.router'
import { routerUpload } from './routers/uploadAPI.router'
import { routerOrder } from './routers/orderAPI.router'
import { routerVoucher } from './routers/voucherAPI.router'

// config
import connectMongoDB from './config/mongoose.config'

import { setupSocket } from './socket/socket'

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

// ROUTER
app.use('/api/auth', routerAuth)
app.use('/api/user', routerUser)
app.use('/api/item', routerItem)
app.use('/api/category', routerCategory)
app.use('/api/cart', routerCart)
app.use('/api/order', routerOrder)
app.use('/api/voucher', routerVoucher)
app.use('/api/upload', routerUpload)

// SETUP SOCKET
setupSocket(server)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
