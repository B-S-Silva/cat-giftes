import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { getMe, updateMe } from '../controllers/usersController.js'

const router = Router()
router.get('/me', authRequired, getMe)
router.put('/me', authRequired, updateMe)

export default router