import { apiClient } from './apiClient'
import type { ApiResponse, ProductCategory } from '@/types'

export const categoryService = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<ProductCategory[]>>('/categories')
    return data.data
  },
  async create(payload: { name: string; slug: string }) {
    const { data } = await apiClient.post<ApiResponse<ProductCategory>>('/categories', payload)
    return data.data
  },
}
