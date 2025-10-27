import { prisma } from '../prisma.js'

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function updateMe(req, res) {
  try {
    const { name, avatarUrl } = req.body
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, avatarUrl },
      select: { id: true, name: true, email: true, avatarUrl: true },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}