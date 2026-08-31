import { Schema, model } from 'mongoose'

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new', index: true },
  },
  { timestamps: true }
)

contactMessageSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const ContactMessage = model('ContactMessage', contactMessageSchema)
