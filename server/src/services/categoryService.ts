import { Category } from '../models/Category'
import { ApiError } from '../utils/ApiError'

export const categoryService = {
  async list() {
    return Category.find().sort({ name: 1 })
  },
  async create(data: { name: string; slug: string }) {
    const existing = await Category.findOne({ slug: data.slug })
    if (existing) throw ApiError.conflict('A category with this slug already exists')
    return Category.create(data)
  },
}
