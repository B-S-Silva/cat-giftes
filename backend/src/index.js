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
// Middleware de CORS global (antes de qualquer rota)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://cat-giftes.vercel.app')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

const PORT = process.env.PORT || 3000

// CORS inteligente
const allowedOrigins = [
  'https://cat-giftes.vercel.app',
  'https://cat-giftes-production.up.railway.app',
]

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (origin.startsWith('http://localhost')) return true
  if (origin.endsWith('.vercel.app')) return true
  return allowedOrigins.includes(origin)
}

app.use((req, res, next) => {
  console.log('🛰️ Requisição de origem:', req.headers.origin)
  next()
})

// Middleware CORS
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        console.warn('🚫 Bloqueado por CORS:', origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// 🔥 Muito importante: tratar OPTIONS manualmente
app.options('*', cors())

// Outros middlewares
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

// Erros
app.use((err, _req, res, _next) => {
  console.error('🔥 Erro não tratado:', err)
  res.status(500).json({ message: 'Server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 API ouvindo em http://localhost:${PORT}`)
})
