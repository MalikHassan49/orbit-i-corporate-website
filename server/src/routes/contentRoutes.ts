import { Router } from 'express'
import { serviceController, caseStudyController, testimonialController, teamController } from '../controllers/contentController'
import { authenticate, authorize } from '../middleware/auth'
import { ADMIN_ROLES } from '../constants/roles'

export const serviceRoutes = Router()
serviceRoutes.get('/', serviceController.list)
serviceRoutes.get('/:slug', serviceController.getBySlug)
serviceRoutes.post('/', authenticate, authorize(...ADMIN_ROLES), serviceController.create)
serviceRoutes.patch('/:id', authenticate, authorize(...ADMIN_ROLES), serviceController.update)
serviceRoutes.delete('/:id', authenticate, authorize(...ADMIN_ROLES), serviceController.remove)

export const caseStudyRoutes = Router()
caseStudyRoutes.get('/', caseStudyController.list)
caseStudyRoutes.get('/admin/all', authenticate, authorize(...ADMIN_ROLES), caseStudyController.listAll)
caseStudyRoutes.get('/:slug', caseStudyController.getBySlug)
caseStudyRoutes.post('/', authenticate, authorize(...ADMIN_ROLES), caseStudyController.create)
caseStudyRoutes.patch('/:id', authenticate, authorize(...ADMIN_ROLES), caseStudyController.update)
caseStudyRoutes.delete('/:id', authenticate, authorize(...ADMIN_ROLES), caseStudyController.remove)

export const testimonialRoutes = Router()
testimonialRoutes.get('/', testimonialController.list)
testimonialRoutes.get('/admin/all', authenticate, authorize(...ADMIN_ROLES), testimonialController.listAll)
testimonialRoutes.post('/', authenticate, authorize(...ADMIN_ROLES), testimonialController.create)
testimonialRoutes.patch('/:id', authenticate, authorize(...ADMIN_ROLES), testimonialController.update)
testimonialRoutes.delete('/:id', authenticate, authorize(...ADMIN_ROLES), testimonialController.remove)

export const teamRoutes = Router()
teamRoutes.get('/', teamController.list)
teamRoutes.get('/admin/all', authenticate, authorize(...ADMIN_ROLES), teamController.listAll)
teamRoutes.post('/', authenticate, authorize(...ADMIN_ROLES), teamController.create)
teamRoutes.patch('/:id', authenticate, authorize(...ADMIN_ROLES), teamController.update)
teamRoutes.delete('/:id', authenticate, authorize(...ADMIN_ROLES), teamController.remove)
