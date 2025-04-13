export const categoryValidation = (name: string) => {
  let error = ''
  if (!name || name.trim() === '') {
    error = 'name is required'
  }

  return error
}
