import { ContactMessage } from '../models/ContactMessage'
import { Job, JobApplication } from '../models/Job'
import { ApiError } from '../utils/ApiError'

export const contactService = {
  async submit(data: {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
  }) {
    return ContactMessage.create(data)
    // TODO: notify the sales inbox via the transactional email provider once configured.
  },

  async list(query: { status?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const filter: Record<string, unknown> = {}
    if (query.status) filter.status = query.status

    const [items, totalItems] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ContactMessage.countDocuments(filter),
    ])
    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },

  async updateStatus(id: string, status: string) {
    const message = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true })
    if (!message) throw ApiError.notFound('Message not found')
    return message
  },
}

export const careersService = {
  async listOpenJobs() {
    return Job.find({ isOpen: true }).sort({ createdAt: -1 })
  },

  async getJobBySlug(slug: string) {
    const job = await Job.findOne({ slug })
    if (!job) throw ApiError.notFound('Job posting not found')
    return job
  },

  async listAllJobs() {
    return Job.find().sort({ createdAt: -1 })
  },

  async createJob(data: Record<string, unknown>) {
    const existing = await Job.findOne({ slug: data.slug as string })
    if (existing) throw ApiError.conflict('A job with this slug already exists')
    return Job.create(data)
  },

  async updateJob(id: string, data: Record<string, unknown>) {
    const job = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!job) throw ApiError.notFound('Job posting not found')
    return job
  },

  async closeJob(id: string) {
    const job = await Job.findByIdAndUpdate(id, { isOpen: false }, { new: true })
    if (!job) throw ApiError.notFound('Job posting not found')
    return job
  },

  async submitApplication(data: {
    jobId: string
    name: string
    email: string
    phone?: string
    resumeUrl: string
    coverLetter?: string
    linkedin?: string
    portfolio?: string
  }) {
    const job = await Job.findById(data.jobId)
    if (!job || !job.isOpen) {
      throw ApiError.badRequest('This position is no longer accepting applications')
    }
    const { jobId, ...rest } = data
    return JobApplication.create({ job: jobId, ...rest })
  },

  async listApplications(query: { jobId?: string; status?: string }) {
    const filter: Record<string, unknown> = {}
    if (query.jobId) filter.job = query.jobId
    if (query.status) filter.status = query.status
    return JobApplication.find(filter).populate('job', 'title').sort({ createdAt: -1 })
  },

  async updateApplicationStatus(id: string, status: string) {
    const application = await JobApplication.findByIdAndUpdate(id, { status }, { new: true })
    if (!application) throw ApiError.notFound('Application not found')
    return application
  },
}
