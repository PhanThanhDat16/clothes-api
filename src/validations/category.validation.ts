import { ICategoryConstants } from '@/constants/category.constants'

export const categoryValidation = (data: ICategoryConstants) => {
  let error = ''
  if (!data.name || data.name.trim() === '') {
    error = 'name is required'
  }

  if (!data.description || data.description.trim() === '') {
    error = 'name is required'
  }

  return error
}
