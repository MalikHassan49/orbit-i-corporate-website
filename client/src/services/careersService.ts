import { apiClient } from './apiClient'
import type { ApiResponse, Job } from '@/types'

export interface JobApplicationPayload {
  jobId: string
  name: string
  email: string
  phone?: string
  resumeUrl: string
  coverLetter?: string
  linkedin?: string
  portfolio?: string
}

export interface JobApplicationRecord {
  id: string
  job: { id: string; title: string } | string
  name: string
  email: string
  status: 'new' | 'reviewed' | 'rejected' | 'hired'
  createdAt: string
}

export const careersService = {
  async listOpenJobs() {
    const { data } = await apiClient.get<ApiResponse<Job[]>>('/careers/jobs')
    return data.data
  },
  async getJobBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<Job>>(`/careers/jobs/${slug}`)
    return data.data
  },
  async listAllJobs() {
    const { data } = await apiClient.get<ApiResponse<Job[]>>('/careers/jobs/admin/all')
    return data.data
  },
  async closeJob(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Job>>(`/careers/jobs/${id}/close`)
    return data.data
  },
  async submitApplication(payload: JobApplicationPayload) {
    const { data } = await apiClient.post<ApiResponse<JobApplicationRecord>>('/careers/applications', payload)
    return data.data
  },
  async listApplications(params: { jobId?: string; status?: string } = {}) {
    const { data } = await apiClient.get<ApiResponse<JobApplicationRecord[]>>('/careers/applications', { params })
    return data.data
  },
}
