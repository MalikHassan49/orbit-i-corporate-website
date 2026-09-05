import { Schema, model } from 'mongoose'

const caseStudySchema = new Schema(
  {
    projectName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    clientIndustry: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    technologies: { type: [String], default: [] },
    results: { type: [String], default: [] },
    coverImage: { type: String },
    gallery: { type: [String], default: [] },
    content: { type: String },
    testimonial: {
      quote: { type: String },
      author: { type: String },
      role: { type: String },
    },
    metrics: { type: [{ label: String, value: String }], default: [] },
    seoTitle: { type: String, trim: true, maxlength: 180 },
    seoDescription: { type: String, trim: true, maxlength: 320 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

caseStudySchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const CaseStudy = model('CaseStudy', caseStudySchema)
