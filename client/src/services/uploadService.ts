import { apiClient } from './apiClient'
import type { ApiResponse } from '@/types'

export const uploadService = {
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    const { data } = await apiClient.post<ApiResponse<{ url: string }>>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.url
  },
}
