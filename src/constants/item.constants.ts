export enum EStatusItemSize {
  MS = 'M',
  LS = 'L',
  XL = 'XL'
}

export interface IOptionsItemConstants {
  itemId?: string
  size?: EStatusItemSize
  stockQuantity?: number
}

export interface IItemModelConstants {
  name?: string
  description?: string
  price?: number
  oldPrice?: number
  categoryId?: string
  images?: string[]
}

export interface IItemConstants extends IItemModelConstants {
  options?: IOptionsItemConstants[]
}

export interface IItemSizeConstants {
  itemId?: string
  size?: EStatusItemSize
  stockQuantity?: number
}
