import { Schema, model } from 'mongoose'

const postRevisionSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: ['save', 'restore', 'autosave'], default: 'save' },
  },
  { timestamps: true },
)

postRevisionSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const PostRevision = model('PostRevision', postRevisionSchema)
