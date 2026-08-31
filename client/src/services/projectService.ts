import { apiClient } from './apiClient'
import type { ApiResponse, Project } from '@/types'

export const projectService = {
  async listMine() {
    const { data } = await apiClient.get<ApiResponse<Project[]>>('/projects/mine')
    return data.data
  },
  async getMine(id: string) {
    const { data } = await apiClient.get<ApiResponse<Project>>(`/projects/mine/${id}`)
    return data.data
  },
  async listAll(params: { clientId?: string; status?: string } = {}) {
    const { data } = await apiClient.get<ApiResponse<(Project & { client: { fullName: string; email: string } })[]>>(
      '/projects',
      { params }
    )
    return data.data
  },
}
