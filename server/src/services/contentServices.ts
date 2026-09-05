import { Service } from '../models/Service'
import { CaseStudy } from '../models/CaseStudy'
import { Testimonial } from '../models/Misc'
import { ApiError } from '../utils/ApiError'
import { BlogPost } from '../models/BlogPost'
import { PostRevision } from '../models/PostRevision'
import { Category } from '../models/Category'
import { Tag } from '../models/Tag'
import { isValidObjectId } from 'mongoose'
import { sanitizeRichText, slugify } from '../utils/sanitize'

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
    const payload = { ...data }
    if (typeof payload.content === 'string') payload.content = sanitizeRichText(payload.content)
    return CaseStudy.create(payload)
  },
  async update(id: string, data: Record<string, unknown>) {
    const payload = { ...data }
    if (typeof payload.content === 'string') payload.content = sanitizeRichText(payload.content)
    const caseStudy = await CaseStudy.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    if (!caseStudy) throw ApiError.notFound('Case study not found')
    return caseStudy
  },
  async remove(id: string) {
    const caseStudy = await CaseStudy.findByIdAndDelete(id)
    if (!caseStudy) throw ApiError.notFound('Case study not found')
  },
}

export const blogPostService = {
  async list(query: { category?: string; tag?: string; search?: string; page?: number; limit?: number; includeDrafts?: boolean }) {
    await BlogPost.updateMany({ status: 'scheduled', scheduledAt: { $lte: new Date() } }, { $set: { status: 'published', publishedAt: new Date() } })
    const page = Math.max(1, query.page ?? 1)
    const limit = Math.min(50, Math.max(1, query.limit ?? 12))
    const filter: Record<string, unknown> = query.includeDrafts ? {} : { $or: [{ status: 'published' }, { status: 'scheduled', scheduledAt: { $lte: new Date() } }] }
    if (query.category) {
      const category = await Category.findOne(isValidObjectId(query.category) ? { $or: [{ _id: query.category }, { slug: query.category }] } : { slug: query.category }).select('_id')
      if (!category) return { items: [], page, totalItems: 0, totalPages: 0 }
      filter.category = category.id
    }
    if (query.tag) {
      const tag = await Tag.findOne(isValidObjectId(query.tag) ? { $or: [{ _id: query.tag }, { slug: query.tag }] } : { slug: query.tag }).select('_id')
      if (!tag) return { items: [], page, totalItems: 0, totalPages: 0 }
      filter.tags = tag.id
    }
    if (query.search) {
      const expression = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      const visibility = filter.$or
      delete filter.$or
      filter.$and = visibility
        ? [{ $or: visibility }, { $or: [{ title: expression }, { excerpt: expression }, { content: expression }] }]
        : [{ $or: [{ title: expression }, { excerpt: expression }, { content: expression }] }]
    }
    const [items, totalItems] = await Promise.all([
      BlogPost.find(filter).populate('category tags author', 'name slug fullName').sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      BlogPost.countDocuments(filter),
    ])
    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },
  async getBySlug(slug: string, includeDrafts = false) {
    await BlogPost.updateMany({ status: 'scheduled', scheduledAt: { $lte: new Date() } }, { $set: { status: 'published', publishedAt: new Date() } })
    const filter: Record<string, unknown> = { slug }
    if (!includeDrafts) filter.status = 'published'
    const post = await BlogPost.findOne(filter).populate('category tags author', 'name slug fullName')
    if (!post) throw ApiError.notFound('Blog post not found')
    if (!includeDrafts) await BlogPost.updateOne({ _id: post.id }, { $inc: { views: 1 } })
    return post
  },
  async create(data: Record<string, any>, author: string) {
    const payload: Record<string, any> = { ...data, slug: data.slug || slugify(data.title), author, content: sanitizeRichText(data.content) }
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date()
    if (payload.status === 'scheduled' && !payload.scheduledAt) throw ApiError.badRequest('Scheduled posts require a scheduled time')
    return BlogPost.create(payload)
  },
  async update(id: string, data: Record<string, any>, changedBy?: string, reason: 'save' | 'autosave' | 'restore' = 'save') {
    const previous = await BlogPost.findById(id)
    if (!previous) throw ApiError.notFound('Blog post not found')
    if (changedBy && (data.title || data.excerpt || data.content)) {
      await PostRevision.create({ post: previous.id, title: previous.title, excerpt: previous.excerpt, content: previous.content, changedBy, reason })
    }
    const payload = { ...data }
    if (payload.title && !payload.slug) payload.slug = slugify(payload.title)
    if (payload.content) payload.content = sanitizeRichText(payload.content)
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date()
    if (payload.status === 'scheduled' && !payload.scheduledAt) throw ApiError.badRequest('Scheduled posts require a scheduled time')
    const post = await BlogPost.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('category tags author', 'name slug fullName')
    if (!post) throw ApiError.notFound('Blog post not found')
    return post
  },
  async remove(id: string) {
    const post = await BlogPost.findByIdAndDelete(id)
    if (!post) throw ApiError.notFound('Blog post not found')
  },
  async setPublished(id: string, published: boolean) {
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { status: published ? 'published' : 'draft', publishedAt: published ? new Date() : undefined },
      { new: true, runValidators: true },
    )
    if (!post) throw ApiError.notFound('Blog post not found')
    return post
  },
  async duplicate(id: string, author: string) {
    const post = await BlogPost.findById(id).lean()
    if (!post) throw ApiError.notFound('Blog post not found')
    const { _id, createdAt, updatedAt, slug, ...copy } = post
    const duplicateSlug = `${slug}-copy-${Date.now().toString(36)}`
    return BlogPost.create({ ...copy, title: `${post.title} (Copy)`, slug: duplicateSlug, author, status: 'draft', publishedAt: undefined, scheduledAt: undefined })
  },
  async revisions(id: string) {
    return PostRevision.find({ post: id }).populate('changedBy', 'fullName').sort({ createdAt: -1 }).limit(50)
  },
  async restoreRevision(id: string, revisionId: string, changedBy: string) {
    const revision = await PostRevision.findOne({ _id: revisionId, post: id })
    if (!revision) throw ApiError.notFound('Revision not found')
    return this.update(id, { title: revision.title, excerpt: revision.excerpt, content: revision.content }, changedBy, 'restore')
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
