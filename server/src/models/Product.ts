import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, required: true, maxlength: 240 },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['available', 'coming_soon', 'archived'], default: 'available', index: true },
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', shortDescription: 'text' })

productSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Product = model('Product', productSchema)
