import mongoose, { Document } from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, require: true }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Category = mongoose.model('Category', categorySchema)

export interface ICategory extends Document {
  name?: string
  description?: string
}
