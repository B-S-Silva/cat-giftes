import axios from 'axios'

// Cria a instância do Axios apontando para a API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', // porta do backend local
})

// Adiciona o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
