import { Router, type Request, type Response } from 'express'
import { categoryService, tagService } from '../services/categoryService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { authenticate, authorize } from '../middleware/auth'
import { SEO_CONTENT_ROLES } from '../constants/roles'
import { validateBody } from '../middleware/validate'
import { createCategorySchema, updateCategorySchema, createTagSchema, updateTagSchema } from '../validators/catalogValidators'

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
  authorize(...SEO_CONTENT_ROLES),
  validateBody(createCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.body)
    return sendSuccess(res, 201, 'Category created', category)
  })
)
 
router.patch('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), validateBody(updateCategorySchema), asyncHandler(async (req, res) =>
  sendSuccess(res, 200, 'Category updated', await categoryService.update(req.params.id as string, req.body))))
router.delete('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id as string)
  return sendSuccess(res, 200, 'Category deleted', null)
}))
 
const tagRouter = Router()
tagRouter.get('/', asyncHandler(async (_req, res) => sendSuccess(res, 200, 'Tags fetched', await tagService.list())))
tagRouter.post('/', authenticate, authorize(...SEO_CONTENT_ROLES), validateBody(createTagSchema), asyncHandler(async (req, res) =>
  sendSuccess(res, 201, 'Tag created', await tagService.create(req.body))))
tagRouter.patch('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), validateBody(updateTagSchema), asyncHandler(async (req, res) =>
  sendSuccess(res, 200, 'Tag updated', await tagService.update(req.params.id as string, req.body))))
tagRouter.delete('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), asyncHandler(async (req, res) => {
  await tagService.remove(req.params.id as string)
  return sendSuccess(res, 200, 'Tag deleted', null)
}))
router.use('/tags', tagRouter)

export default router
