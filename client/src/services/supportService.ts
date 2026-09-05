import { apiClient } from './apiClient'
import type { ApiResponse, SupportTicket } from '@/types'

export interface SupportTicketRecord extends SupportTicket {
  user: {
    fullName: string
    email: string
  }
}

export const supportService = {
  async create(payload: { subject: string; message: string }) {
    const { data } = await apiClient.post<ApiResponse<SupportTicket>>('/support', payload)
    return data.data
  },
  async listMine() {
    const { data } = await apiClient.get<ApiResponse<SupportTicket[]>>('/support/mine')
    return data.data
  },
  async listAll(params: { status?: string } = {}) {
    const { data } = await apiClient.get<ApiResponse<SupportTicketRecord[]>>('/support', { params })
    return data.data
  },
  async updateStatus(id: string, status: string) {
    const { data } = await apiClient.patch<ApiResponse<SupportTicket>>(`/support/${id}/status`, { status })
    return data.data
  },
}
