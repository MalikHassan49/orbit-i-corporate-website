import { Router } from 'express'
import { userController } from '../controllers/userController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { updateProfileSchema, createEditorSchema } from '../validators/authValidators'
import { ADMIN_ROLES, ROLES } from '../constants/roles'

const router = Router()

router.get('/me', authenticate, userController.me)
router.patch('/me', authenticate, validateBody(updateProfileSchema), userController.updateMe)

router.get('/', authenticate, authorize(...ADMIN_ROLES), userController.listClients)
router.patch('/:id/status', authenticate, authorize(...ADMIN_ROLES), userController.setActiveStatus)
router.post('/editors', authenticate, authorize(ROLES.SUPER_ADMIN), validateBody(createEditorSchema), userController.createEditor)

export default router
