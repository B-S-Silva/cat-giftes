import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { createWishlist, getWishlists, getWishlistById } from '../controllers/wishlistsController.js'

const router = Router()
router.post('/', authRequired, createWishlist)
router.get('/', getWishlists)
router.get('/:id', getWishlistById)

export default router