import { prisma } from '../prisma.js'

export async function addItem(req, res) {
  try {
    const wishlistId = req.params.id
    const wl = await prisma.wishlist.findUnique({ where: { id: wishlistId } })
    if (!wl) return res.status(404).json({ message: 'Wishlist not found' })
    if (wl.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const { name, link, price, description } = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const item = await prisma.item.create({
      data: {
        wishlistId,
        name,
        link,
        price: price ? parseFloat(price) : undefined,
        description,
        imageUrl,
      },
    })
    res.status(201).json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function updateItem(req, res) {
  try {
    const id = req.params.id
    const existing = await prisma.item.findUnique({
      where: { id },
      include: { wishlist: true },
    })
    if (!existing) return res.status(404).json({ message: 'Item not found' })
    if (existing.wishlist.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const { name, link, price, description, isPurchased } = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined

    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        link,
        price: price !== undefined ? parseFloat(price) : undefined,
        description,
        isPurchased: isPurchased !== undefined ? !!isPurchased : undefined,
        imageUrl,
      },
    })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteItem(req, res) {
  try {
    const id = req.params.id
    const existing = await prisma.item.findUnique({
      where: { id },
      include: { wishlist: true },
    })
    if (!existing) return res.status(404).json({ message: 'Item not found' })
    if (existing.wishlist.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.item.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}