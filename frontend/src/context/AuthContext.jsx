import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrapSession() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await api.get('/auth/me')
        if (!cancelled) setUser(data)
      } catch {
        if (!cancelled) {
          localStorage.removeItem('token')
          setToken('')
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrapSession()
    return () => {
      cancelled = true
    }
  }, [token])

  async function register(email, password) {
    await api.post('/auth/register', { email, password })
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
