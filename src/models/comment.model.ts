import mongoose, { Document } from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    content: { type: String, required: true }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Comment = mongoose.model('Comment', commentSchema)

export interface IComment extends Document {
  userId?: string
  itemId?: string
  content?: string
}
