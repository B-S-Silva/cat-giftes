import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'

const router = Router()
router.post('/', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

export default router