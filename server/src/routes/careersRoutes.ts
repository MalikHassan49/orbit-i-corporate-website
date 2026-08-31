import { Router } from 'express'
import { careersController } from '../controllers/contactAndCareersController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { publicWriteRateLimiter } from '../middleware/rateLimiter'
import { jobApplicationSchema } from '../validators/catalogValidators'
import { ADMIN_ROLES } from '../constants/roles'

const router = Router()

// Public: jobs
router.get('/jobs', careersController.listOpenJobs)
router.get('/jobs/:slug', careersController.getJobBySlug)

// Admin: jobs
router.get('/jobs/admin/all', authenticate, authorize(...ADMIN_ROLES), careersController.listAllJobs)
router.post('/jobs', authenticate, authorize(...ADMIN_ROLES), careersController.createJob)
router.patch('/jobs/:id', authenticate, authorize(...ADMIN_ROLES), careersController.updateJob)
router.patch('/jobs/:id/close', authenticate, authorize(...ADMIN_ROLES), careersController.closeJob)

// Public: applications
router.post(
  '/applications',
  publicWriteRateLimiter,
  validateBody(jobApplicationSchema),
  careersController.submitApplication
)

// Admin: applications
router.get('/applications', authenticate, authorize(...ADMIN_ROLES), careersController.listApplications)
router.patch(
  '/applications/:id/status',
  authenticate,
  authorize(...ADMIN_ROLES),
  careersController.updateApplicationStatus
)

export default router
