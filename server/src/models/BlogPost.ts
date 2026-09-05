import { Schema, model } from 'mongoose'

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft', index: true },
    publishedAt: { type: Date },
    scheduledAt: { type: Date, index: true },
    seoTitle: { type: String, trim: true, maxlength: 180 },
    seoDescription: { type: String, trim: true, maxlength: 320 },
    focusKeyword: { type: String, trim: true, maxlength: 120 },
    secondaryKeywords: [{ type: String, trim: true, maxlength: 120 }],
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    ogTitle: { type: String, trim: true, maxlength: 180 },
    ogDescription: { type: String, trim: true, maxlength: 320 },
    robots: { type: String, enum: ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'], default: 'index,follow' },
    views: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

blogPostSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const BlogPost = model('BlogPost', blogPostSchema)
