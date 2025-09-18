import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
)

export const Conversation = mongoose.model('Conversation', conversationSchema)

export interface IConversation extends Document {
  userId?: string
}
