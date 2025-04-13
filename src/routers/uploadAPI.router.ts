import express from 'express'
import { upload } from '@/middlewares/upload.middlewares'
import { uploadController } from '@/controllers/upload/upload.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post('/', requireAuth, upload.array('images', 3), uploadController.uploadImages)

export const routerUpload = router
