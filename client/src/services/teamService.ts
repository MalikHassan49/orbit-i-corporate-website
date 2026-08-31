import { apiClient } from './apiClient'
import type { ApiResponse, TeamMember } from '@/types'

export const teamService = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<TeamMember[]>>('/team')
    return data.data
  },
  async listAll() {
    const { data } = await apiClient.get<ApiResponse<TeamMember[]>>('/team/admin/all')
    return data.data
  },
}
