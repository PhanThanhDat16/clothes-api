// Libs
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

// Constants
import { HttpStatus } from '@/constants/http.constants'
import { IAuthConstants } from '@/constants/auth.constants'

// Validations
import { authValidation } from '@/validations/auth.validation'

// Services
import { authService } from '@/services/auth/auth.service'
import { refreshTokenService } from '@/services/refreshToken/refreshToken.service'

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const { email, password } = data
    const validation = authValidation(email, password)
    if (Object.keys(validation).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', errors: validation })
      return
    }

    const userCheckLogin = await authService.checkLoginAuth(email, password)
    if (!userCheckLogin) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Incorrect email or password' })
      return
    }

    const inforUser = await authService.findOne(email)
    if (!inforUser) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'User not found' })
      return
    }
    delete inforUser['password']

    const dataToken = {
      id: userCheckLogin._id.toString(),
      email: userCheckLogin.email,
      fullName: userCheckLogin.fullName,
      phone: userCheckLogin.phone,
      avatar: userCheckLogin.avatar
    }
    const accessToken = authController.generateAccessToken(dataToken as IAuthConstants)
    const refreshToken = await authController.generateRefreshToken(dataToken as IAuthConstants)
    res.status(HttpStatus.OK).json({
      message: 'Login successfulfly',
      data: {
        accessToken,
        refreshToken,
        dataToken
      }
    })
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authenticated' })
      return
    }

    // verify the refreshToken
    jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESHTOKEN as string, async (err: any, user: any) => {
      if (err) {
        res.status(HttpStatus.FORBIDDEN).json({ message: `Refresh token is not valid ${err}` })
        return
      }

      const tokenExists = await refreshTokenService.exists(refreshToken)
      if (!tokenExists) {
        res.status(HttpStatus.FORBIDDEN).json({ message: 'Refresh token is not valid' })
        return
      }

      delete user.iat
      delete user.exp

      // generate new accessToken
      const newAccessToken = authController.generateAccessToken(user as IAuthConstants)
      res.status(HttpStatus.OK).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken
      })
      return
    })
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    await refreshTokenService.delete(refreshToken)
    res.status(HttpStatus.OK).json({ message: 'Logged out successfully' })
  }),

  generateAccessToken: (user: IAuthConstants) => {
    const accessToken = jwt.sign(user, process.env.SECRET_KEY_ACCESSTOKEN as string, {
      expiresIn: parseInt(process.env.EXPIRES_ACCESSTOKEN as string)
    })
    return accessToken
  },

  generateRefreshToken: async (user: IAuthConstants) => {
    const refreshToken = jwt.sign(user, process.env.SECRET_KEY_REFRESHTOKEN as string, {
      expiresIn: parseInt(process.env.EXPIRES_REFRESHTOKEN as string)
    })

    await refreshTokenService.save(refreshToken, user.email)

    return refreshToken
  }
}
