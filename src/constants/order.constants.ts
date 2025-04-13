import { EStatusItemSize } from './item.constants'

export enum EStatusOrder {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid'
}

export interface IOrderConstants {
  userId: string
  totalPrice: number
  finalTotal: number
  status: EStatusOrder
  discount: number
  voucherId: string
}

export interface IOrderItemConstants {
  orderId: string
  itemId: string
  size: string
  quantity: number
  price: number
}

export interface IOrderItemRequestConstants {
  itemId: string
  size: EStatusItemSize
  quantity: number
}
