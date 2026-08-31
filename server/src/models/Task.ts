import { Schema, model } from 'mongoose'

const taskSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  { timestamps: true }
)

taskSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Task = model('Task', taskSchema)
