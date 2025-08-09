import { IUserConstants } from '@/constants/user.constants'

export const userValidation = {
  validateRegister: (data: IUserConstants) => {
    const errors: {
      password?: string
      fullName?: string
      email?: string
      phone?: string
    } = {}

    if (!data.email || data.email.trim() === '') {
      errors.email = 'email is required'
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
      email?: string
      fullName?: string
      phone?: string
    } = {}

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required'
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
