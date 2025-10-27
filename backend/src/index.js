import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import wishlistsRoutes from './routes/wishlists.js'
import itemsRoutes from './routes/items.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const RAW_ORIGINS = process.env.CORS_ORIGIN || 'http://localhost:5173'
const ALLOWED_ORIGINS = RAW_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(1)
      return origin.endsWith(domain)
    }
    return origin === allowed
  })
}

app.use(cors({ origin: (origin, cb) => cb(null, isAllowedOrigin(origin)), credentials: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')))

app.get('/', (_req, res) => res.json({ ok: true, name: 'Cat Giftes API' }))
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/wishlists', wishlistsRoutes)
app.use('/', itemsRoutes)
app.use('/upload', uploadRoutes)

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Server error' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})