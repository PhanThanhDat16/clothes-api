// Libs
import { Request, Response } from 'express'

// Services
import { categoryService } from '@/services/category/category.service'

// Constants
import { HttpStatus } from '@/constants/http.constants'

import { categoryValidation } from '@/validations/category.validation'

export const categoryController = {
  createCategory: async (req: Request, res: Response) => {
    try {
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
        message: 'create successfully'
      })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error ' + error
      })
      return
    }
  },

  getCategoryDetail: async (req: Request, res: Response) => {
    try {
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

      res.status(HttpStatus.OK).json(category)
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error ' + error
      })
      return
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
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

      res.status(HttpStatus.OK).json({ message: 'deleted successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error ' + error
      })
      return
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    try {
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

      res.status(HttpStatus.OK).json({ message: 'updated successfully' })
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error ' + error
      })
      return
    }
  },

  getAllCategory: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getAll()
      res.status(HttpStatus.OK).json(categories)
      return
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error ' + error
      })
      return
    }
  }
}
