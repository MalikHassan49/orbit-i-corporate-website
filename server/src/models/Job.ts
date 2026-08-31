import { Schema, model } from 'mongoose'

const jobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
      required: true,
    },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    isOpen: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

jobSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Job = model('Job', jobSchema)

const jobApplicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    status: { type: String, enum: ['new', 'reviewed', 'rejected', 'hired'], default: 'new' },
  },
  { timestamps: true }
)

jobApplicationSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const JobApplication = model('JobApplication', jobApplicationSchema)
