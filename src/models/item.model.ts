import mongoose, { Document } from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    price: { type: Number },
    oldPrice: { type: Number },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true },
    images: { type: [String] }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Item = mongoose.model('Item', itemSchema)
itemSchema.index({name: "text", description: "text"})

export interface IItem extends Document {
  name?: string
  description?: string
  price?: number
  oldPrice?: number
  categoryId?: string
  images?: string[]
}
