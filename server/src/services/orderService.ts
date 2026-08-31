import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { ApiError } from '../utils/ApiError'

interface CreateOrderInput {
  userId: string
  items: { productId: string; quantity: number }[]
}

export const orderService = {
  async create(input: CreateOrderInput) {
    const products = await Product.find({ _id: { $in: input.items.map((i) => i.productId) } })
    if (products.length !== input.items.length) {
      throw ApiError.badRequest('One or more products in this order could not be found')
    }

    const items = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      if (product.status !== 'available') {
        throw ApiError.badRequest(`"${product.name}" is not currently available for purchase`)
      }
      return {
        product: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      }
    })

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    return Order.create({ user: input.userId, items, total, currency: 'USD', status: 'pending' })
  },

  async listForUser(userId: string) {
    return Order.find({ user: userId }).sort({ createdAt: -1 })
  },

  async getForUser(orderId: string, userId: string) {
    const order = await Order.findOne({ _id: orderId, user: userId })
    if (!order) throw ApiError.notFound('Order not found')
    return order
  },

  async listAll(query: { status?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const filter: Record<string, unknown> = {}
    if (query.status) filter.status = query.status

    const [items, totalItems] = await Promise.all([
      Order.find(filter)
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
    ])

    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },

  async updateStatus(orderId: string, status: string) {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    if (!order) throw ApiError.notFound('Order not found')
    return order
  },
}
