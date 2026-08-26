import axios from 'axios'

const LOCAL_API_BASE = 'http://localhost:3001/api'

const deployedApiBase = window.location.pathname.startsWith('/~')
  ? `/${window.location.pathname.split('/')[1]}/api`
  : '/api'

export const API_BASE = import.meta.env.VITE_API_BASE
  ?? (import.meta.env.DEV ? LOCAL_API_BASE : deployedApiBase)

export const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)
