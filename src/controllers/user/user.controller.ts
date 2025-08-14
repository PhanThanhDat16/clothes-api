//Libs
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Services
import { userService } from '@/services/user/user.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'

// Validations
import { userValidation } from '@/validations/user.validation'

// Models
import { IUser } from '@/models/user.model'

export const userController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data: IUser = req.body
    const { email, password, fullName, phone, type = 'user' } = data

    const validation = userValidation.validateRegister({
      email: email as string,
      password,
      fullName,
      phone: phone as string
    })
    if (Object.keys(validation).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Validation error',
        error: validation
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userService.registerUser({
      email: email as string,
      password: hashedPassword,
      fullName,
      phone: phone as string,
      type
    })
    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User already exists',
        error: 'User already exists'
      })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'register successfully' })
  }),

  profile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User id is required'
      })
      return
    }

    const user = await userService.getUserById(userId)
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found'
      })
      return
    }

    delete user['password']

    res.status(HttpStatus.OK).json({
      message: 'Get profile successfully',
      data: user
    })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const data: IUser = req.body
    const { fullName, phone, email, totalBill } = data

    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User id is required'
      })
      return
    }

    const validation = userValidation.validateUpdate({ email, fullName, phone: phone as string })
    if (Object.keys(validation).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Validation error',
        errors: validation
      })
      return
    }

    const user = await userService.updateUser(userId, {
      fullName,
      email,
      phone: phone as string,
      totalBill
    })
    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User already exists'
      })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Update successfully', data: user })
  }),

  getAllUser: asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAll()
    res.status(HttpStatus.OK).json({
      message: 'Get all user successfully',
      data: users
    })
  })
}
