import type { Request, Response } from 'express'
import { serviceContentService, caseStudyService, testimonialService } from '../services/contentServices'
import { teamService } from '../services/teamService'
import { adminDashboardService } from '../services/adminDashboardService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'

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
