import { prisma } from '../prisma.js'

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true, xp: true, level: true, streak: true, lastActive: true, badges: true },
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

function computeLevel(xp) {
  // Simple level curve: every 100xp -> +1 level
  return Math.max(1, Math.floor(xp / 100) + 1)
}

export async function awardXp(req, res) {
  try {
    const { amount } = req.body
    const delta = Number(amount || 0)
    if (!Number.isFinite(delta) || delta <= 0) return res.status(400).json({ message: 'Invalid XP amount' })
    const current = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!current) return res.status(404).json({ message: 'User not found' })
    const newXp = (current.xp || 0) + delta
    const newLevel = computeLevel(newXp)
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: newXp, level: newLevel },
      select: { id: true, name: true, avatarUrl: true, xp: true, level: true }
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function bumpStreak(req, res) {
  try {
    const current = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!current) return res.status(404).json({ message: 'User not found' })
    const now = new Date()
    let streak = current.streak || 0
    let last = current.lastActive ? new Date(current.lastActive) : null
    const isNewDay = !last || last.toDateString() !== now.toDateString()
    if (isNewDay) streak += 1
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { streak, lastActive: now },
      select: { id: true, name: true, avatarUrl: true, streak: true, lastActive: true }
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function addBadge(req, res) {
  try {
    const { badge } = req.body
    if (!badge) return res.status(400).json({ message: 'Badge required' })
    const current = await prisma.user.findUnique({ where: { id: req.user.id } })
    const badges = Array.isArray(current.badges) ? current.badges : []
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { badges: [...badges, badge] },
      select: { id: true, badges: true }
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}