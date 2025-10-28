import api from './api'

export const getPublicWishlists = async () => {
  const { data } = await api.get('/wishlists', { params: { public: true } })
  return data
}

export const getMyWishlists = async () => {
  const { data } = await api.get('/wishlists', { params: { mine: true } })
  return data
}

export const createWishlist = async ({ title, description, isPublic, eventDate }) => {
  const { data } = await api.post('/wishlists', { title, description, isPublic, eventDate })
  return data
}

export const updateWishlist = async (id, { title, description, isPublic, eventDate }) => {
  const { data } = await api.put(`/wishlists/${id}`, { title, description, isPublic, eventDate })
  return data
}

export const getWishlistById = async (id) => {
  const { data } = await api.get(`/wishlists/${id}`)
  return data
}