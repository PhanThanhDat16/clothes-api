// Libs
import cloudinary from '@/config/cloudinary.config'
import { Request, Response } from 'express'
import fs from 'fs'
import asyncHandler from 'express-async-handler'

// Constants
import { HttpStatus } from '@/constants/http.constants'

import { filesEndpoint } from '@/utils/file.ultils'

export const uploadController = {
  uploadImages: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'No files uploaded' })
      return
    }
    const allowedFormat = filesEndpoint
    const maxSize = 1024 * 1024

    const errors: {
      invalid?: string
      maxsize?: string
    } = {}

    for (const file of files) {
      if (!allowedFormat.includes(file.mimetype)) {
        errors.invalid = 'Invalid file format'
      }
      if (file.size > maxSize) {
        errors.invalid = 'The file size is too large. Please select a file smaller than 1MB'
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: { ...errors }
      })
      return
    }

    const uploadPromises = files.map((file) => {
      return cloudinary.uploader
        .upload(file.path, {
          folder: 'clothes-item'
        })
        .then((result) => {
          fs.unlinkSync(file.path)
          return result.secure_url
        })
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    res.status(HttpStatus.OK).json({
      message: 'Uploaded successfully',
      images: uploadedUrls
    })
  })
}
