import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'
import { addItem, updateItem, deleteItem } from '../controllers/itemsController.js'

const router = Router()
router.post('/wishlists/:id/items', authRequired, upload.single('image'), addItem)
router.put('/items/:id', authRequired, upload.single('image'), updateItem)
router.delete('/items/:id', authRequired, deleteItem)

export default router