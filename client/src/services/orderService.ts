import { apiClient } from './apiClient'
import type { ApiResponse, Order, PaginatedResult } from '@/types'

export const orderService = {
  async create(items: { productId: string; quantity: number }[]) {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', { items })
    return data.data
  },
  async listMine() {
    const { data } = await apiClient.get<ApiResponse<Order[]>>('/orders/mine')
    return data.data
  },
  async getMine(id: string) {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/mine/${id}`)
    return data.data
  },
  async listAll(params: { status?: string; page?: number; limit?: number } = {}) {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<Order & { user: { fullName: string; email: string } }>>>(
      '/orders',
      { params }
    )
    return data.data
  },
  async updateStatus(id: string, status: string) {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })
    return data.data
  },
}
