// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Services
import { categoryService } from '@/services/category/category.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'

import { categoryValidation } from '@/validations/category.validation'

export const categoryController = {
  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const validate = categoryValidation(data)
    if (Object.keys(validate).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', error: validate })
      return
    }
    const category = await categoryService.create(data)
    if (!category) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Category already exists'
      })
      return
    }

    res.status(HttpStatus.OK).json({
      message: 'create successfully',
      data: category
    })
  }),

  getCategoryDetail: asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id
    if (!categoryId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'category id is required'
      })
      return
    }
    const category = await categoryService.getCategoryById(categoryId)
    if (!category) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'category not found'
      })
      return
    }
    res.status(HttpStatus.OK).json({
      message: 'Get category successfully',
      data: category
    })
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id
    if (!categoryId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'category id is required'
      })
      return
    }

    const category = await categoryService.deleteCategory(categoryId)
    if (!category) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'category not found'
      })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'deleted successfully', data: category })
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const categoryId = req.params.id
    if (!categoryId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'category id is required'
      })
      return
    }

    const validate = categoryValidation(data)
    if (Object.keys(validate).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', error: validate })
      return
    }

    const category = await categoryService.updateCategory(categoryId, data)
    if (!category) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'category not found'
      })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'updated successfully', data: category })
  }),

  getAllCategory: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = (req.query.search as string) || ''
    const result = await categoryService.getAll(page, limit, search)

    res.status(HttpStatus.OK).json({
      message: 'Get all category successfully',
      data: {
        ...result
      }
    })
  })
}
