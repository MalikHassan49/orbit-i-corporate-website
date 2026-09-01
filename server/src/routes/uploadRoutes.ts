import { Router } from 'express'
import { uploadController } from '../controllers/uploadController'
import { authenticate, authorize } from '../middleware/auth'
import { uploadImage } from '../middleware/upload'
import { ADMIN_ROLES } from '../constants/roles'

const router = Router()

router.post('/image', authenticate, authorize(...ADMIN_ROLES), uploadImage.single('image'), uploadController.image)

export default router
