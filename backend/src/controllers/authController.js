import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'

const TOKEN_EXPIRES = '7d'

export async function register(req, res) {
  try {
    const { name, email, password, avatarUrl } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(409).json({ message: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, passwordHash, avatarUrl } })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}