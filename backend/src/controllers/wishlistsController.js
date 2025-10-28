import { prisma } from '../prisma.js'

export async function createWishlist(req, res) {
  try {
    const { title, description, isPublic, eventDate } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })
    const w = await prisma.wishlist.create({
      data: { 
        title, 
        description, 
        isPublic: !!isPublic, 
        userId: req.user.id,
        eventDate: eventDate ? new Date(eventDate) : undefined,
      },
    })
    res.status(201).json(w)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function getWishlists(req, res) {
  try {
    const { public: publicQuery, mine } = req.query
    let where = {}
    if (publicQuery === 'true') where = { isPublic: true }
    else if (mine === 'true') where = { userId: req.user?.id }
    else where = { isPublic: true }

    const list = await prisma.wishlist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true, user: { select: { id: true, name: true, avatarUrl: true } } },
    })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function getWishlistById(req, res) {
  try {
    const id = req.params.id
    const w = await prisma.wishlist.findUnique({
      where: { id },
      include: { items: true, user: { select: { id: true, name: true, avatarUrl: true } } },
    })
    if (!w) return res.status(404).json({ message: 'Not found' })
    if (!w.isPublic && w.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    res.json(w)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function updateWishlist(req, res) {
  try {
    const id = req.params.id
    const existing = await prisma.wishlist.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ message: 'Not found' })
    if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const { title, description, isPublic, eventDate } = req.body
    const updated = await prisma.wishlist.update({
      where: { id },
      data: {
        title,
        description,
        isPublic: isPublic !== undefined ? !!isPublic : undefined,
        eventDate: eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : undefined,
      },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}