import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const API_BASE_URL = 'http://localhost:5000/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)

  const authHeaders = useMemo(() => {
    if (!token) return {}
    return {
      Authorization: `Bearer ${token}`,
    }
  }, [token])

  useEffect(() => {
    async function bootstrapSession() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/me`, {
          headers: authHeaders,
        })
        setUser(data)
      } catch {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrapSession()
  }, [authHeaders, token])

  async function register(email, password) {
    await axios.post(`${API_BASE_URL}/register`, { email, password })
  }

  async function login(email, password) {
    const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password })
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
