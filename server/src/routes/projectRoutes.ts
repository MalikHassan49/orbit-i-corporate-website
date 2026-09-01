import { Router } from 'express'
import { projectController } from '../controllers/projectController'
import { authenticate, authorize } from '../middleware/auth'
import { ADMIN_ROLES, ROLES } from '../constants/roles'

const router = Router()

// Client
router.get('/mine', authenticate, authorize(ROLES.CLIENT), projectController.listMine)
router.get('/mine/:id', authenticate, authorize(ROLES.CLIENT), projectController.getMine)

// Admin
router.get('/', authenticate, authorize(...ADMIN_ROLES), projectController.listAll)
router.post('/', authenticate, authorize(...ADMIN_ROLES), projectController.create)
router.patch('/:id', authenticate, authorize(...ADMIN_ROLES), projectController.update)
router.delete('/:id', authenticate, authorize(...ADMIN_ROLES), projectController.remove)
router.post('/:id/milestones', authenticate, authorize(...ADMIN_ROLES), projectController.addMilestone)
router.patch(
  '/:id/milestones/:milestoneId',
  authenticate,
  authorize(...ADMIN_ROLES),
  projectController.toggleMilestone
)
router.post('/:id/updates', authenticate, authorize(...ADMIN_ROLES), projectController.postUpdate)

export default router
