import { IItemConstants } from '@/constants/item.constants'

export const itemValidation = {
  validateCreate: (data: IItemConstants) => {
    const errors: {
      name?: string
      description?: string
      price?: string
      oldPrice?: string
    } = {}

    if (!data.name || data.name.trim() === '') {
      errors.name = 'name is required'
    }
    if (!data.description || data.description.trim() === '') {
      errors.description = 'description is required'
    }
    if (!data.price) {
      errors.price = 'price is required'
    }
    if (!data.oldPrice) {
      errors.oldPrice = 'oldPrice is required'
    }
    return errors
  }
}
