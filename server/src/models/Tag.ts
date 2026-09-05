import { Schema, model } from 'mongoose'

const tagSchema = new Schema(
  { name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true } },
  { timestamps: true }
)

tagSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Tag = model('Tag', tagSchema)
