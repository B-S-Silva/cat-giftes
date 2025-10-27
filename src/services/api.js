import axios from 'axios'

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function normalizeBaseUrl(url) {
  if (!url) return 'http://localhost:4000'
  let u = String(url).trim()
  // Corrige protocolos sem dois-pontos: "https//" -> "https://", "http//" -> "http://"
  if (u.startsWith('https//')) u = 'https://' + u.slice('https//'.length)
  if (u.startsWith('http//')) u = 'http://' + u.slice('http//'.length)
  // Remove duplicação de protocolo: "https://https://" -> "https://"
  u = u.replace(/^(https?:\/\/)(https?:\/\/)/i, '$1')
  // Remove barras finais
  u = u.replace(/\/+$/, '')
  return u
}

const BASE_URL = normalizeBaseUrl(RAW_BASE_URL)

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const API_BASE_URL = BASE_URL
export default api