import { IUserConstants } from '@/constants/user.constants'

export const userValidation = {
  validateRegister: (data: IUserConstants) => {
    const errors: {
      username?: string
      password?: string
      fullName?: string
      email?: string
      phone?: string
    } = {}

    if (!data.username || data.username.trim() === '') {
      errors.username = 'Username is required'
    }

    if (!data.password || data.password.trim() === '') {
      errors.password = 'Password is required'
    }

    if (!data.fullName || data.fullName.trim() === '') {
      errors.fullName = 'Full name is required'
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required'
    }

    return errors
  },

  validateUpdate: (data: IUserConstants) => {
    const errors: {
      username?: string
      fullName?: string
      phone?: string
    } = {}

    if (!data.username || data.username.trim() === '') {
      errors.username = 'Username is required'
    }

    if (!data.fullName || data.fullName.trim() === '') {
      errors.fullName = 'Full name is required'
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required'
    }

    return errors
  }
}
