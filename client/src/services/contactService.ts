import { apiClient } from './apiClient'
import type { ApiResponse, ContactSubmission } from '@/types'

export interface ContactMessageRecord extends ContactSubmission {
  id: string
  status: 'new' | 'contacted' | 'closed'
  createdAt: string
}

export const contactService = {
  async submit(payload: ContactSubmission) {
    const { data } = await apiClient.post<ApiResponse<null>>('/contact', payload)
    return data.message
  },
  async list(params: { status?: string } = {}) {
    const { data } = await apiClient.get<ApiResponse<{ items: ContactMessageRecord[] }>>('/contact', { params })
    return data.data.items
  },
  async updateStatus(id: string, status: string) {
    const { data } = await apiClient.patch<ApiResponse<ContactMessageRecord>>(`/contact/${id}/status`, { status })
    return data.data
  },
}
