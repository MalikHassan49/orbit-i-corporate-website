import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import productRoutes from './productRoutes'
import categoryRoutes from './categoryRoutes'
import orderRoutes from './orderRoutes'
import projectRoutes from './projectRoutes'
import careersRoutes from './careersRoutes'
import uploadRoutes from './uploadRoutes'
import supportRoutes from './supportRoutes'
import { serviceRoutes, caseStudyRoutes, testimonialRoutes, teamRoutes, blogPostRoutes } from './contentRoutes'
import { contactRoutes, adminRoutes } from './miscRoutes'
import { Service } from '../models/Service'
import { Product } from '../models/Product'
import { CaseStudy } from '../models/CaseStudy'
import { Job } from '../models/Job'
import { BlogPost } from '../models/BlogPost'
import { env } from '../config/env'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/projects', projectRoutes)
router.use('/services', serviceRoutes)
router.use('/case-studies', caseStudyRoutes)
router.use('/testimonials', testimonialRoutes)
router.use('/team', teamRoutes)
router.use('/blog', blogPostRoutes)
router.use('/careers', careersRoutes)
router.use('/uploads', uploadRoutes)
router.use('/support', supportRoutes)
router.use('/contact', contactRoutes)
router.use('/admin', adminRoutes)

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ORBIT-I API is running', data: { timestamp: new Date().toISOString() } })
})

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const [services, products, studies, jobs, posts] = await Promise.all([
      Service.find().select('slug updatedAt'),
      Product.find({ status: { $ne: 'archived' } }).select('slug updatedAt'),
      CaseStudy.find({ isPublished: true }).select('slug updatedAt'),
      Job.find({ isOpen: true }).select('slug updatedAt'),
      BlogPost.find({ status: 'published' }).select('slug updatedAt'),
    ])
    const base = env.publicSiteUrl
    const urls = [
      '/', '/about', '/services', '/products', '/case-studies', '/blog', '/team', '/careers', '/contact',
      ...services.map((x) => `/services/${x.slug}`), ...products.map((x) => `/products/${x.slug}`),
      ...studies.map((x) => `/case-studies/${x.slug}`), ...jobs.map((x) => `/careers/${x.slug}`),
      ...posts.map((x) => `/blog/${x.slug}`),
    ]
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${base}${url}</loc></url>`).join('')}</urlset>`
    res.type('application/xml').send(xml)
  } catch (error) { next(error) }
})

export default router
