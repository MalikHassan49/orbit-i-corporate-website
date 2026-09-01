import { Router } from 'express'
import { supportController } from '../controllers/supportController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { createSupportTicketSchema } from '../validators/catalogValidators'
import { ADMIN_ROLES, ROLES } from '../constants/roles'

const router = Router()

router.post('/', authenticate, authorize(ROLES.CLIENT), validateBody(createSupportTicketSchema), supportController.create)
router.get('/mine', authenticate, authorize(ROLES.CLIENT), supportController.listMine)
router.get('/', authenticate, authorize(...ADMIN_ROLES), supportController.listAll)
router.patch('/:id/status', authenticate, authorize(...ADMIN_ROLES), supportController.updateStatus)

export default router
