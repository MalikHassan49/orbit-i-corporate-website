import { Schema, model } from 'mongoose'

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String },
    linkedinUrl: { type: String },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

teamMemberSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const TeamMember = model('TeamMember', teamMemberSchema)
