import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResult, Product } from '@/types'

export interface ProductListParams {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}

export const productService = {
  async list(params: ProductListParams = {}) {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/products', { params })
    return data.data
  },

  async getBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`)
    return data.data
  },
}
