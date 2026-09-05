import { User } from '../models/User'
import { ApiError } from '../utils/ApiError'
import bcrypt from 'bcryptjs'
import { ROLES } from '../constants/roles'

export const userService = {
  async getById(id: string) {
    const user = await User.findById(id)
    if (!user) throw ApiError.notFound('User not found')
    return user
  },

  async updateProfile(id: string, updates: { fullName?: string; avatarUrl?: string }) {
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!user) throw ApiError.notFound('User not found')
    return user
  },

  async listClients(query: { search?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const filter: Record<string, unknown> = { role: 'client' }

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ]
    }

    const [items, totalItems] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ])

    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },

  async setActiveStatus(id: string, isActive: boolean) {
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true })
    if (!user) throw ApiError.notFound('User not found')
    return user
  },
  async createEditor(input: { fullName: string; email: string; password: string }) {
    if (await User.findOne({ email: input.email })) throw ApiError.conflict('An account with this email already exists')
    return User.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: ROLES.EDITOR,
      isVerified: true,
    })
  },

  async createSeoManager(input: { fullName: string; email: string; password: string }) {
    if (await User.findOne({ email: input.email })) throw ApiError.conflict('An account with this email already exists')
    return User.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: ROLES.SEO_MANAGER,
      isVerified: true,
    })
  },
}
