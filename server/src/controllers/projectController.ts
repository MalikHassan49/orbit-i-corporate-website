import type { Request, Response } from 'express'
import { projectService } from '../services/projectService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

export const projectController = {
  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const projects = await projectService.listForClient(req.user.id)
    return sendSuccess(res, 200, 'Projects fetched', projects)
  }),

  getMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const project = await projectService.getForClient((req.params.id as string), req.user.id)
    return sendSuccess(res, 200, 'Project fetched', project)
  }),

  listAll: asyncHandler(async (req: Request, res: Response) => {
    const { clientId, status } = req.query
    const projects = await projectService.listAll({
      clientId: clientId as string | undefined,
      status: status as string | undefined,
    })
    return sendSuccess(res, 200, 'Projects fetched', projects)
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.body)
    return sendSuccess(res, 201, 'Project created', project)
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Project updated', project)
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove((req.params.id as string))
    return sendSuccess(res, 200, 'Project deleted', null)
  }),

  addMilestone: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.addMilestone((req.params.id as string), req.body)
    return sendSuccess(res, 201, 'Milestone added', project)
  }),

  toggleMilestone: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.toggleMilestone((req.params.id as string), (req.params.milestoneId as string), req.body.isComplete)
    return sendSuccess(res, 200, 'Milestone updated', project)
  }),

  postUpdate: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.postUpdate((req.params.id as string), req.body.message)
    return sendSuccess(res, 201, 'Update posted', project)
  }),
}
