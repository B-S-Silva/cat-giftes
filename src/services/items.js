import api from './api'

export const addItem = async (wishlistId, { name, link, price, description, imageFile }) => {
  const fd = new FormData()
  if (imageFile) fd.append('image', imageFile)
  if (name) fd.append('name', name)
  if (link) fd.append('link', link)
  if (price !== undefined && price !== null) fd.append('price', String(price))
  if (description) fd.append('description', description)

  const { data } = await api.post(`/wishlists/${wishlistId}/items`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateItem = async (id, { name, link, price, description, isPurchased, imageFile }) => {
  const fd = new FormData()
  if (imageFile) fd.append('image', imageFile)
  if (name !== undefined) fd.append('name', name)
  if (link !== undefined) fd.append('link', link)
  if (price !== undefined && price !== null) fd.append('price', String(price))
  if (description !== undefined) fd.append('description', description)
  if (isPurchased !== undefined) fd.append('isPurchased', String(!!isPurchased))

  const { data } = await api.put(`/items/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`)
  return data
}