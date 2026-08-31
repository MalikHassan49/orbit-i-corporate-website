import { Project } from '../models/Project'
import { ApiError } from '../utils/ApiError'

export const projectService = {
  async listForClient(clientId: string) {
    return Project.find({ client: clientId }).sort({ createdAt: -1 })
  },

  async getForClient(projectId: string, clientId: string) {
    const project = await Project.findOne({ _id: projectId, client: clientId })
    if (!project) throw ApiError.notFound('Project not found')
    return project
  },

  async listAll(query: { clientId?: string; status?: string }) {
    const filter: Record<string, unknown> = {}
    if (query.clientId) filter.client = query.clientId
    if (query.status) filter.status = query.status
    return Project.find(filter).populate('client', 'fullName email').sort({ createdAt: -1 })
  },

  async create(data: Record<string, unknown>) {
    return Project.create(data)
  },

  async update(id: string, data: Record<string, unknown>) {
    const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!project) throw ApiError.notFound('Project not found')
    return project
  },

  async addMilestone(id: string, milestone: { title: string; dueDate: Date }) {
    const project = await Project.findByIdAndUpdate(
      id,
      { $push: { milestones: milestone } },
      { new: true, runValidators: true }
    )
    if (!project) throw ApiError.notFound('Project not found')
    return project
  },

  async toggleMilestone(projectId: string, milestoneId: string, isComplete: boolean) {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, 'milestones._id': milestoneId },
      { $set: { 'milestones.$.isComplete': isComplete } },
      { new: true }
    )
    if (!project) throw ApiError.notFound('Project or milestone not found')
    return project
  },

  async postUpdate(id: string, message: string) {
    const project = await Project.findByIdAndUpdate(
      id,
      { $push: { updates: { message, postedAt: new Date() } } },
      { new: true }
    )
    if (!project) throw ApiError.notFound('Project not found')
    return project
  },
}
