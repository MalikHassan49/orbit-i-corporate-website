import { apiClient } from './apiClient'
import type { ApiResponse, SupportTicket } from '@/types'

export const supportService = {
  async create(payload: { subject: string; message: string }) {
    const { data } = await apiClient.post<ApiResponse<SupportTicket>>('/support', payload)
    return data.data
  },
  async listMine() {
    const { data } = await apiClient.get<ApiResponse<SupportTicket[]>>('/support/mine')
    return data.data
  },
}
