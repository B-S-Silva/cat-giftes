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

// --- CORS Global (muito importante: vem antes de tudo) ---
const FRONTEND_ORIGIN = 'https://cat-giftes.vercel.app'

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN)
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204) // responde preflight
  }

  next()
})

// Middlewares padrão
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')))

// Rotas
app.get('/', (_req, res) => res.json({ ok: true, name: 'Cat Giftes API' }))
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/wishlists', wishlistsRoutes)
app.use('/', itemsRoutes)
app.use('/upload', uploadRoutes)

// Erro global
app.use((err, _req, res, _next) => {
  console.error('🔥 Erro não tratado:', err)
  res.status(500).json({ message: 'Server error' })
})

// Start
app.listen(PORT, () => {
  console.log(`🚀 API ouvindo em http://localhost:${PORT}`)
})
