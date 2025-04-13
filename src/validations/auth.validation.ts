export const authValidation = (username: string, password: string) => {
  const errors: {
    username?: string
    password?: string
  } = {}

  if (!username || username.trim() === '') {
    errors.username = 'Username is required'
  }

  if (!password || password.trim() === '') {
    errors.password = 'Password is required'
  }
  return errors
}
