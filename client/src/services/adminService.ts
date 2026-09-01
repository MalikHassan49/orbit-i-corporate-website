import { apiClient } from './apiClient'
import type { ApiResponse, CaseStudy, Job, PaginatedResult, Product, Project, Service, TeamMember, Testimonial, User } from '@/types'

export interface AdminMetrics {
  totalClients: number
  totalOrders: number
  activeProducts: number
  activeProjects: number
  pendingLeads: number
  revenue: number
}

export const adminService = {
  async getMetrics() {
    const { data } = await apiClient.get<ApiResponse<AdminMetrics>>('/admin/dashboard')
    return data.data
  },

  async listClients(params: { search?: string; page?: number; limit?: number } = {}) {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<User>>>('/users', { params })
    return data.data
  },

  async setClientActive(id: string, isActive: boolean) {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { isActive })
    return data.data
  },

  async createProduct(payload: {
    name: string
    slug: string
    category: string
    shortDescription: string
    description: string
    price: number
    features?: string[]
    status?: Product['status']
  }) {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload)
    return data.data
  },
  async updateProduct(id: string, payload: Partial<Omit<Product, 'category'>> & { category?: string }) {
    const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload)
    return data.data
  },
  async archiveProduct(id: string) {
    const { data } = await apiClient.delete<ApiResponse<Product>>(`/products/${id}`)
    return data.data
  },

  async createCaseStudy(payload: Partial<CaseStudy> & { slug: string }) {
    const { data } = await apiClient.post<ApiResponse<CaseStudy>>('/case-studies', payload)
    return data.data
  },
  async updateCaseStudy(id: string, payload: Partial<CaseStudy>) {
    const { data } = await apiClient.patch<ApiResponse<CaseStudy>>(`/case-studies/${id}`, payload)
    return data.data
  },
  async deleteCaseStudy(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/case-studies/${id}`)
  },

  async createTestimonial(payload: Partial<Testimonial>) {
    const { data } = await apiClient.post<ApiResponse<Testimonial>>('/testimonials', payload)
    return data.data
  },
  async updateTestimonial(id: string, payload: Partial<Testimonial>) {
    const { data } = await apiClient.patch<ApiResponse<Testimonial>>(`/testimonials/${id}`, payload)
    return data.data
  },
  async deleteTestimonial(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/testimonials/${id}`)
  },

  async createService(payload: Partial<Service> & { slug: string }) {
    const { data } = await apiClient.post<ApiResponse<Service>>('/services', payload)
    return data.data
  },

  async createProject(payload: {
    name: string
    client: string
    status?: string
    progress?: number
    assignedTeam?: string[]
    startDate: string
    targetDate?: string
  }) {
    const { data } = await apiClient.post<ApiResponse<Project>>('/projects', payload)
    return data.data
  },
  async updateProject(id: string, payload: Partial<Omit<Project, 'id' | 'clientId' | 'milestones'>>) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, payload)
    return data.data
  },
  async deleteProject(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/projects/${id}`)
  },

  async createJob(payload: {
    title: string
    slug: string
    department: string
    location: string
    employmentType: string
    experience: string
    description: string
    requirements: string[]
    responsibilities: string[]
  }) {
    const { data } = await apiClient.post<ApiResponse<Job>>('/careers/jobs', payload)
    return data.data
  },
  async updateJob(id: string, payload: Partial<Job>) {
    const { data } = await apiClient.patch<ApiResponse<Job>>(`/careers/jobs/${id}`, payload)
    return data.data
  },

  async createTeamMember(payload: {
    name: string
    designation: string
    bio: string
    avatarUrl?: string
    linkedinUrl?: string
    skills?: string[]
  }) {
    const { data } = await apiClient.post<ApiResponse<TeamMember>>('/team', payload)
    return data.data
  },
  async updateTeamMember(id: string, payload: Partial<TeamMember>) {
    const { data } = await apiClient.patch<ApiResponse<TeamMember>>(`/team/${id}`, payload)
    return data.data
  },
  async deleteTeamMember(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/team/${id}`)
  },
}
