import api from './api'

export const addItem = async (wishlistId, { name, link, price, description, priority, imageFile }) => {
  const fd = new FormData()
  if (imageFile) fd.append('image', imageFile)
  if (name) fd.append('name', name)
  if (link) fd.append('link', link)
  if (price !== undefined && price !== null) fd.append('price', String(price))
  if (description) fd.append('description', description)
  if (priority) fd.append('priority', priority)

  const { data } = await api.post(`/wishlists/${wishlistId}/items`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateItem = async (id, { name, link, price, description, isPurchased, priority, imageFile }) => {
  const fd = new FormData()
  if (imageFile) fd.append('image', imageFile)
  if (name !== undefined) fd.append('name', name)
  if (link !== undefined) fd.append('link', link)
  if (price !== undefined && price !== null) fd.append('price', String(price))
  if (description !== undefined) fd.append('description', description)
  if (isPurchased !== undefined) fd.append('isPurchased', String(!!isPurchased))
  if (priority !== undefined) fd.append('priority', priority)

  const { data } = await api.put(`/items/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`)
  return data
}

export const reserveItem = async (id) => {
  const { data } = await api.post(`/items/${id}/reserve`)
  return data
}

export const unreserveItem = async (id) => {
  const { data } = await api.post(`/items/${id}/unreserve`)
  return data
}