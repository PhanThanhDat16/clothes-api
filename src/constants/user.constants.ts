export enum EStatusTypeUser {
  USER = 'user',
  ADMIN = 'admin'
}

export interface IUserConstants {
  avatar?: string
  password?: string
  email?: string
  fullName: string
  phone?: string
  type?: EStatusTypeUser
  totalBill?: number
}
