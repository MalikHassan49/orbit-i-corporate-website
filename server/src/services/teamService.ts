import { TeamMember } from '../models/TeamMember'
import { ApiError } from '../utils/ApiError'

export const teamService = {
  async list() {
    return TeamMember.find({ isPublished: true }).sort({ order: 1, createdAt: 1 })
  },
  async listAll() {
    return TeamMember.find().sort({ order: 1, createdAt: 1 })
  },
  async create(data: Record<string, unknown>) {
    return TeamMember.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const member = await TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!member) throw ApiError.notFound('Team member not found')
    return member
  },
  async remove(id: string) {
    const member = await TeamMember.findByIdAndDelete(id)
    if (!member) throw ApiError.notFound('Team member not found')
  },
}
