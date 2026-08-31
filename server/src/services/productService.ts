import { Product } from '../models/Product'
import { ApiError } from '../utils/ApiError'

interface ListQuery {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}

export const productService = {
  async list(query: ListQuery) {
    const page = query.page ?? 1
    const limit = query.limit ?? 12
    const filter: Record<string, unknown> = {}

    if (query.search) filter.$text = { $search: query.search }
    if (query.category) filter.category = query.category
    if (query.status) filter.status = query.status

    const [items, totalItems] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ])

    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },

  async getBySlug(slug: string) {
    const product = await Product.findOne({ slug }).populate('category', 'name slug')
    if (!product) throw ApiError.notFound('Product not found')
    return product
  },

  async getById(id: string) {
    const product = await Product.findById(id)
    if (!product) throw ApiError.notFound('Product not found')
    return product
  },

  async create(data: Record<string, unknown>) {
    const existing = await Product.findOne({ slug: data.slug as string })
    if (existing) throw ApiError.conflict('A product with this slug already exists')
    return Product.create(data)
  },

  async update(id: string, data: Record<string, unknown>) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!product) throw ApiError.notFound('Product not found')
    return product
  },

  async archive(id: string) {
    const product = await Product.findByIdAndUpdate(id, { status: 'archived' }, { new: true })
    if (!product) throw ApiError.notFound('Product not found')
    return product
  },
}
