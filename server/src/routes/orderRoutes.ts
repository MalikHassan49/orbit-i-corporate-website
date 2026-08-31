import { Router } from 'express'
import { orderController } from '../controllers/orderController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { createOrderSchema, updateOrderStatusSchema } from '../validators/catalogValidators'
import { ADMIN_ROLES, ROLES } from '../constants/roles'

const router = Router()

// Client
router.post('/', authenticate, authorize(ROLES.CLIENT), validateBody(createOrderSchema), orderController.create)
router.get('/mine', authenticate, authorize(ROLES.CLIENT), orderController.listMine)
router.get('/mine/:id', authenticate, authorize(ROLES.CLIENT), orderController.getMine)

// Admin
router.get('/', authenticate, authorize(...ADMIN_ROLES), orderController.listAll)
router.patch(
  '/:id/status',
  authenticate,
  authorize(...ADMIN_ROLES),
  validateBody(updateOrderStatusSchema),
  orderController.updateStatus
)

export default router
