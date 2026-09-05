import { Router } from 'express'
import { serviceController, caseStudyController, testimonialController, teamController, blogPostController } from '../controllers/contentController'
import { authenticate, authorize } from '../middleware/auth'
import { CONTENT_EDITOR_ROLES, SEO_CONTENT_ROLES } from '../constants/roles'
import { validateBody } from '../middleware/validate'
import { createBlogPostSchema, updateBlogPostSchema } from '../validators/catalogValidators'

export const serviceRoutes = Router()
serviceRoutes.get('/', serviceController.list)
serviceRoutes.get('/:slug', serviceController.getBySlug)
serviceRoutes.post('/', authenticate, authorize(...CONTENT_EDITOR_ROLES), serviceController.create)
serviceRoutes.patch('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), serviceController.update)
serviceRoutes.delete('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), serviceController.remove)

export const caseStudyRoutes = Router()
caseStudyRoutes.get('/', caseStudyController.list)
caseStudyRoutes.get('/admin/all', authenticate, authorize(...SEO_CONTENT_ROLES), caseStudyController.listAll)
caseStudyRoutes.get('/:slug', caseStudyController.getBySlug)
caseStudyRoutes.post('/', authenticate, authorize(...SEO_CONTENT_ROLES), caseStudyController.create)
caseStudyRoutes.patch('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), caseStudyController.update)
caseStudyRoutes.delete('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), caseStudyController.remove)

export const testimonialRoutes = Router()
testimonialRoutes.get('/', testimonialController.list)
testimonialRoutes.get('/admin/all', authenticate, authorize(...CONTENT_EDITOR_ROLES), testimonialController.listAll)
testimonialRoutes.post('/', authenticate, authorize(...CONTENT_EDITOR_ROLES), testimonialController.create)
testimonialRoutes.patch('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), testimonialController.update)
testimonialRoutes.delete('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), testimonialController.remove)

export const teamRoutes = Router()
teamRoutes.get('/', teamController.list)
teamRoutes.get('/admin/all', authenticate, authorize(...CONTENT_EDITOR_ROLES), teamController.listAll)
teamRoutes.post('/', authenticate, authorize(...CONTENT_EDITOR_ROLES), teamController.create)
teamRoutes.patch('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), teamController.update)
teamRoutes.delete('/:id', authenticate, authorize(...CONTENT_EDITOR_ROLES), teamController.remove)

export const blogPostRoutes = Router()
blogPostRoutes.get('/', blogPostController.list)
blogPostRoutes.get('/admin/all', authenticate, authorize(...SEO_CONTENT_ROLES), (req, res, next) => {
  req.query.includeDrafts = 'true'
  return blogPostController.list(req, res, next)
})
blogPostRoutes.get('/:slug', blogPostController.getBySlug)
blogPostRoutes.post('/', authenticate, authorize(...SEO_CONTENT_ROLES), validateBody(createBlogPostSchema), blogPostController.create)
blogPostRoutes.patch('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), validateBody(updateBlogPostSchema), blogPostController.update)
blogPostRoutes.delete('/:id', authenticate, authorize(...SEO_CONTENT_ROLES), blogPostController.remove)
blogPostRoutes.patch('/:id/publish', authenticate, authorize(...SEO_CONTENT_ROLES), blogPostController.publish)
blogPostRoutes.patch('/:id/unpublish', authenticate, authorize(...SEO_CONTENT_ROLES), blogPostController.unpublish)
