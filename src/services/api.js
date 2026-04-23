import axios from 'axios'

// API Service Layer
//
// TO MIGRATE TO REAL API:
//   1. Set VITE_API_URL in your .env file (e.g. https://api.yourcompany.com)
//   2. Set VITE_USE_MOCK=false in your .env file
//   3. Remove the mock interceptor block below
//   4. All query/mutation functions in features/*/api/ will work as-is

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    if (status === 403) {
      console.error('Forbidden: insufficient permissions')
    }
    return Promise.reject(error)
  }
)

export default api
