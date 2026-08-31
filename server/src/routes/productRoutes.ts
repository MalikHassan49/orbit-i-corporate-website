import { Router } from 'express'
import { productController } from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { createProductSchema, updateProductSchema } from '../validators/catalogValidators'
import { ADMIN_ROLES } from '../constants/roles'

const router = Router()

// Public
router.get('/', productController.list)
router.get('/:slug', productController.getBySlug)

// Admin
router.post('/', authenticate, authorize(...ADMIN_ROLES), validateBody(createProductSchema), productController.create)
router.patch('/:id', authenticate, authorize(...ADMIN_ROLES), validateBody(updateProductSchema), productController.update)
router.delete('/:id', authenticate, authorize(...ADMIN_ROLES), productController.archive)

export default router
