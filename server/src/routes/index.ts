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
import { serviceRoutes, caseStudyRoutes, testimonialRoutes, teamRoutes } from './contentRoutes'
import { contactRoutes, adminRoutes } from './miscRoutes'

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
router.use('/careers', careersRoutes)
router.use('/uploads', uploadRoutes)
router.use('/support', supportRoutes)
router.use('/contact', contactRoutes)
router.use('/admin', adminRoutes)

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ORBIT-I API is running', data: { timestamp: new Date().toISOString() } })
})

export default router
