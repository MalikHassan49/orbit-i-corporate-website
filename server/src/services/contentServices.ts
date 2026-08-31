import { Service } from '../models/Service'
import { CaseStudy } from '../models/CaseStudy'
import { Testimonial } from '../models/Misc'
import { ApiError } from '../utils/ApiError'

export const serviceContentService = {
  async list() {
    return Service.find().sort({ createdAt: -1 })
  },
  async getBySlug(slug: string) {
    const service = await Service.findOne({ slug })
    if (!service) throw ApiError.notFound('Service not found')
    return service
  },
  async create(data: Record<string, unknown>) {
    return Service.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!service) throw ApiError.notFound('Service not found')
    return service
  },
  async remove(id: string) {
    const service = await Service.findByIdAndDelete(id)
    if (!service) throw ApiError.notFound('Service not found')
  },
}

export const caseStudyService = {
  async list() {
    return CaseStudy.find({ isPublished: true }).sort({ createdAt: -1 })
  },
  async listAll() {
    return CaseStudy.find().sort({ createdAt: -1 })
  },
  async getBySlug(slug: string) {
    const caseStudy = await CaseStudy.findOne({ slug })
    if (!caseStudy) throw ApiError.notFound('Case study not found')
    return caseStudy
  },
  async create(data: Record<string, unknown>) {
    return CaseStudy.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const caseStudy = await CaseStudy.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!caseStudy) throw ApiError.notFound('Case study not found')
    return caseStudy
  },
  async remove(id: string) {
    const caseStudy = await CaseStudy.findByIdAndDelete(id)
    if (!caseStudy) throw ApiError.notFound('Case study not found')
  },
}

export const testimonialService = {
  async list() {
    return Testimonial.find({ isPublished: true }).sort({ createdAt: -1 })
  },
  async listAll() {
    return Testimonial.find().sort({ createdAt: -1 })
  },
  async create(data: Record<string, unknown>) {
    return Testimonial.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!testimonial) throw ApiError.notFound('Testimonial not found')
    return testimonial
  },
  async remove(id: string) {
    const testimonial = await Testimonial.findByIdAndDelete(id)
    if (!testimonial) throw ApiError.notFound('Testimonial not found')
  },
}
