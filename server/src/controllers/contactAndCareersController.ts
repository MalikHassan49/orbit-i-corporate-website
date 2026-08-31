import type { Request, Response } from 'express'
import { contactService, careersService } from '../services/contactAndCareersService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'

export const contactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    await contactService.submit(req.body)
    return sendSuccess(res, 201, "Message sent — we'll be in touch within one business day", null)
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { status, page, limit } = req.query
    const result = await contactService.list({
      status: status as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })
    return sendSuccess(res, 200, 'Messages fetched', result)
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const message = await contactService.updateStatus((req.params.id as string), req.body.status)
    return sendSuccess(res, 200, 'Status updated', message)
  }),
}

export const careersController = {
  listOpenJobs: asyncHandler(async (_req: Request, res: Response) => {
    const jobs = await careersService.listOpenJobs()
    return sendSuccess(res, 200, 'Jobs fetched', jobs)
  }),

  getJobBySlug: asyncHandler(async (req: Request, res: Response) => {
    const job = await careersService.getJobBySlug((req.params.slug as string))
    return sendSuccess(res, 200, 'Job fetched', job)
  }),

  listAllJobs: asyncHandler(async (_req: Request, res: Response) => {
    const jobs = await careersService.listAllJobs()
    return sendSuccess(res, 200, 'Jobs fetched', jobs)
  }),

  createJob: asyncHandler(async (req: Request, res: Response) => {
    const job = await careersService.createJob(req.body)
    return sendSuccess(res, 201, 'Job posted', job)
  }),

  updateJob: asyncHandler(async (req: Request, res: Response) => {
    const job = await careersService.updateJob((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Job updated', job)
  }),

  closeJob: asyncHandler(async (req: Request, res: Response) => {
    const job = await careersService.closeJob((req.params.id as string))
    return sendSuccess(res, 200, 'Job closed', job)
  }),

  submitApplication: asyncHandler(async (req: Request, res: Response) => {
    const application = await careersService.submitApplication(req.body)
    return sendSuccess(res, 201, 'Application submitted successfully', application)
  }),

  listApplications: asyncHandler(async (req: Request, res: Response) => {
    const { jobId, status } = req.query
    const applications = await careersService.listApplications({
      jobId: jobId as string | undefined,
      status: status as string | undefined,
    })
    return sendSuccess(res, 200, 'Applications fetched', applications)
  }),

  updateApplicationStatus: asyncHandler(async (req: Request, res: Response) => {
    const application = await careersService.updateApplicationStatus((req.params.id as string), req.body.status)
    return sendSuccess(res, 200, 'Application status updated', application)
  }),
}
