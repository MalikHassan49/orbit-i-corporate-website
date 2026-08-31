import { Router, type Request, type Response } from 'express'
import { categoryService } from '../services/categoryService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { authenticate, authorize } from '../middleware/auth'
import { ADMIN_ROLES } from '../constants/roles'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.list()
    return sendSuccess(res, 200, 'Categories fetched', categories)
  })
)

router.post(
  '/',
  authenticate,
  authorize(...ADMIN_ROLES),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.body)
    return sendSuccess(res, 201, 'Category created', category)
  })
)

export default router
