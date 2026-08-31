import { Router } from 'express'
import { authController } from '../controllers/authController'
import { validateBody } from '../middleware/validate'
import { authRateLimiter } from '../middleware/rateLimiter'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators'

const router = Router()

router.post('/register', authRateLimiter, validateBody(registerSchema), authController.register)
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/forgot-password', authRateLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password', authRateLimiter, validateBody(resetPasswordSchema), authController.resetPassword)

export default router
