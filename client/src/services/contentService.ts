import { apiClient } from './apiClient'
import type { ApiResponse, CaseStudy, Service, Testimonial } from '@/types'

export const serviceContentService = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<Service[]>>('/services')
    return data.data
  },
  async getBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<Service>>(`/services/${slug}`)
    return data.data
  },
}

export const caseStudyService = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<CaseStudy[]>>('/case-studies')
    return data.data
  },
  async listAll() {
    const { data } = await apiClient.get<ApiResponse<CaseStudy[]>>('/case-studies/admin/all')
    return data.data
  },
  async getBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<CaseStudy>>(`/case-studies/${slug}`)
    return data.data
  },
}

export const testimonialService = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials')
    return data.data
  },
  async listAll() {
    const { data } = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials/admin/all')
    return data.data
  },
}
