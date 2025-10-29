import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { getMe, updateMe, awardXp, bumpStreak, addBadge } from '../controllers/usersController.js'

const router = Router()
router.get('/me', authRequired, getMe)
router.put('/me', authRequired, updateMe)
router.post('/me/xp', authRequired, awardXp)
router.post('/me/streak', authRequired, bumpStreak)
router.post('/me/badges', authRequired, addBadge)

export default router