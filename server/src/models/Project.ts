import { Schema, model } from 'mongoose'

const milestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['planning', 'in_progress', 'on_hold', 'completed'], default: 'planning' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    assignedTeam: { type: [String], default: [] },
    milestones: { type: [milestoneSchema], default: [] },
    documents: { type: [{ name: String, url: String }], default: [] },
    updates: { type: [{ message: String, postedAt: { type: Date, default: Date.now } }], default: [] },
    startDate: { type: Date, required: true },
    targetDate: { type: Date },
  },
  { timestamps: true }
)

projectSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Project = model('Project', projectSchema)
