import { Schema, model } from 'mongoose'

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
)
notificationSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
export const Notification = model('Notification', notificationSchema)

const invoiceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
    issuedAt: { type: Date, default: Date.now },
    dueAt: { type: Date },
  },
  { timestamps: true }
)
invoiceSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
export const Invoice = model('Invoice', invoiceSchema)

const supportTicketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  },
  { timestamps: true }
)
supportTicketSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
export const SupportTicket = model('SupportTicket', supportTicketSchema)

const testimonialSchema = new Schema(
  {
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    avatarUrl: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)
testimonialSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
export const Testimonial = model('Testimonial', testimonialSchema)
