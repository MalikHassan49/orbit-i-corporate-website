import type { Request, Response } from 'express'
import { serviceContentService, caseStudyService, testimonialService, blogPostService } from '../services/contentServices'
import { teamService } from '../services/teamService'
import { adminDashboardService } from '../services/adminDashboardService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

export const serviceController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const services = await serviceContentService.list()
    return sendSuccess(res, 200, 'Services fetched', services)
  }),
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceContentService.getBySlug((req.params.slug as string))
    return sendSuccess(res, 200, 'Service fetched', service)
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceContentService.create(req.body)
    return sendSuccess(res, 201, 'Service created', service)
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceContentService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Service updated', service)
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await serviceContentService.remove((req.params.id as string))
    return sendSuccess(res, 200, 'Service deleted', null)
  }),
}

export const caseStudyController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const items = await caseStudyService.list()
    return sendSuccess(res, 200, 'Case studies fetched', items)
  }),
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const items = await caseStudyService.listAll()
    return sendSuccess(res, 200, 'Case studies fetched', items)
  }),
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const item = await caseStudyService.getBySlug((req.params.slug as string))
    return sendSuccess(res, 200, 'Case study fetched', item)
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await caseStudyService.create(req.body)
    return sendSuccess(res, 201, 'Case study created', item)
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await caseStudyService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Case study updated', item)
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await caseStudyService.remove((req.params.id as string))
    return sendSuccess(res, 200, 'Case study deleted', null)
  }),
}

export const testimonialController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const items = await testimonialService.list()
    return sendSuccess(res, 200, 'Testimonials fetched', items)
  }),
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const items = await testimonialService.listAll()
    return sendSuccess(res, 200, 'Testimonials fetched', items)
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await testimonialService.create(req.body)
    return sendSuccess(res, 201, 'Testimonial created', item)
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await testimonialService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Testimonial updated', item)
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await testimonialService.remove((req.params.id as string))
    return sendSuccess(res, 200, 'Testimonial deleted', null)
  }),
}

export const adminDashboardController = {
  getMetrics: asyncHandler(async (_req: Request, res: Response) => {
    const metrics = await adminDashboardService.getMetrics()
    return sendSuccess(res, 200, 'Metrics fetched', metrics)
  }),
}

export const teamController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const members = await teamService.list()
    return sendSuccess(res, 200, 'Team members fetched', members)
  }),
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const members = await teamService.listAll()
    return sendSuccess(res, 200, 'Team members fetched', members)
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const member = await teamService.create(req.body)
    return sendSuccess(res, 201, 'Team member added', member)
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const member = await teamService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Team member updated', member)
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await teamService.remove((req.params.id as string))
    return sendSuccess(res, 200, 'Team member removed', null)
  }),
}

export const blogPostController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await blogPostService.list({
      category: req.query.category as string | undefined,
      tag: req.query.tag as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      includeDrafts: Boolean(req.user),
    })
    return sendSuccess(res, 200, 'Blog posts fetched', result)
  }),
  getBySlug: asyncHandler(async (req: Request, res: Response) =>
    sendSuccess(res, 200, 'Blog post fetched', await blogPostService.getBySlug(req.params.slug as string, Boolean(req.user)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    return sendSuccess(res, 201, 'Blog post created', await blogPostService.create(req.body, req.user.id))
  }),
  update: asyncHandler(async (req: Request, res: Response) =>
    sendSuccess(res, 200, 'Blog post updated', await blogPostService.update(req.params.id as string, req.body))),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await blogPostService.remove(req.params.id as string)
    return sendSuccess(res, 200, 'Blog post deleted', null)
  }),
  publish: asyncHandler(async (req: Request, res: Response) =>
    sendSuccess(res, 200, 'Blog post published', await blogPostService.setPublished(req.params.id as string, true))),
  unpublish: asyncHandler(async (req: Request, res: Response) =>
    sendSuccess(res, 200, 'Blog post unpublished', await blogPostService.setPublished(req.params.id as string, false))),
}
