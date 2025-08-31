import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authController } from '../auth/auth.controller'

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string
    email: string
    fullName: string
    phone?: string
    avatar?: string
  }
}

export const googleCallback = (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.redirect(`${process.env.URL_CLIENT}/login`)
    }

    if (!process.env.SECRET_KEY_ACCESSTOKEN) {
      throw new Error('Missing ACCESS_TOKEN_SECRET in environment variables')
    }

    const value = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || ''
    }

    const accessToken = authController.generateAccessToken(value)
    const refreshToken = authController.generateRefreshToken(value)

    // Redirect về frontend + kèm token
    res.redirect(`${process.env.URL_CLIENT}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`)
  } catch (err) {
    console.error(err)
    res.redirect(`${process.env.URL_CLIENT}/login`)
  }
}
