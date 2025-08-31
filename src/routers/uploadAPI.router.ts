import express from 'express'
import { upload } from '@/middlewares/upload.middlewares'
import { uploadController } from '@/controllers/upload/upload.controller'
import { requireAuth } from '@/middlewares/auth.middlewares'

const router = express.Router()

router.post(
  '/',
  requireAuth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  uploadController.uploadImage
)

export const routerUpload = router
