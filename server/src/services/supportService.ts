import { SupportTicket } from '../models/Misc'
import { ApiError } from '../utils/ApiError'

export const supportService = {
  async create(data: { userId: string; subject: string; message: string }) {
    return SupportTicket.create({ user: data.userId, subject: data.subject, message: data.message, status: 'open' })
  },

  async listForUser(userId: string) {
    return SupportTicket.find({ user: userId }).sort({ createdAt: -1 })
  },

  async listAll(query: { status?: string }) {
    const filter: Record<string, unknown> = {}
    if (query.status) filter.status = query.status
    return SupportTicket.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 })
  },

  async updateStatus(id: string, status: string) {
    const ticket = await SupportTicket.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    if (!ticket) throw ApiError.notFound('Support ticket not found')
    return ticket
  },
}
