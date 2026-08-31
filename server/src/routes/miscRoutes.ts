import { Router } from 'express'
import { contactController } from '../controllers/contactAndCareersController'
import { adminDashboardController } from '../controllers/contentController'
import { authenticate, authorize } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { publicWriteRateLimiter } from '../middleware/rateLimiter'
import { contactMessageSchema } from '../validators/catalogValidators'
import { ADMIN_ROLES } from '../constants/roles'

export const contactRoutes = Router()
contactRoutes.post('/', publicWriteRateLimiter, validateBody(contactMessageSchema), contactController.submit)
contactRoutes.get('/', authenticate, authorize(...ADMIN_ROLES), contactController.list)
contactRoutes.patch('/:id/status', authenticate, authorize(...ADMIN_ROLES), contactController.updateStatus)

export const adminRoutes = Router()
adminRoutes.get('/dashboard', authenticate, authorize(...ADMIN_ROLES), adminDashboardController.getMetrics)
