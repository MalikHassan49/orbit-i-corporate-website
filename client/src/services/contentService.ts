import { apiClient } from './apiClient'
import type { ApiResponse, BlogPost, CaseStudy, Category, Service, Tag, Testimonial } from '@/types'

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

export const blogService = {
  async list(params?: { category?: string; tag?: string; search?: string; page?: number }) {
    const { data } = await apiClient.get<ApiResponse<{ items: BlogPost[]; page: number; totalPages: number; totalItems: number }>>('/blog', { params })
    return data.data
  },
  async getBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`)
    return data.data
  },
  async listAll() {
    const { data } = await apiClient.get<ApiResponse<{ items: BlogPost[] }>>('/blog/admin/all')
    return data.data.items
  },
  async create(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<BlogPost>>('/blog', payload)
    return data.data
  },
  async update(id: string, payload: Record<string, unknown>) {
    const { data } = await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}`, payload)
    return data.data
  },
  async remove(id: string) { await apiClient.delete(`/blog/${id}`) },
  async duplicate(id: string) { return (await apiClient.post<ApiResponse<BlogPost>>(`/blog/${id}/duplicate`)).data.data },
  async revisions(id: string) { return (await apiClient.get<ApiResponse<Array<{ id: string; title: string; excerpt: string; content: string; createdAt: string }>>>(`/blog/${id}/revisions`)).data.data },
  async restoreRevision(id: string, revisionId: string) { return (await apiClient.post<ApiResponse<BlogPost>>(`/blog/${id}/revisions/${revisionId}/restore`)).data.data },
  async publish(id: string) { return (await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}/publish`)).data.data },
  async unpublish(id: string) { return (await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}/unpublish`)).data.data },
}

export const taxonomyService = {
  async categories() { return (await apiClient.get<ApiResponse<Category[]>>('/categories')).data.data },
  async tags() { return (await apiClient.get<ApiResponse<Tag[]>>('/categories/tags')).data.data },
  async createCategory(payload: { name: string; slug?: string }) { return (await apiClient.post<ApiResponse<Category>>('/categories', payload)).data.data },
  async updateCategory(id: string, payload: { name?: string; slug?: string }) { return (await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload)).data.data },
  async deleteCategory(id: string) { await apiClient.delete(`/categories/${id}`) },
  async createTag(payload: { name: string; slug?: string }) { return (await apiClient.post<ApiResponse<Tag>>('/categories/tags', payload)).data.data },
  async updateTag(id: string, payload: { name?: string; slug?: string }) { return (await apiClient.patch<ApiResponse<Tag>>(`/categories/tags/${id}`, payload)).data.data },
  async deleteTag(id: string) { await apiClient.delete(`/categories/tags/${id}`) },
}
