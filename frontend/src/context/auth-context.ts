import { createContext, useContext } from 'react'

export interface PublicUser {
  readonly id: string
  readonly email: string
}

export interface AuthContextType {
  readonly user: PublicUser | null
  readonly token: string
  readonly loading: boolean
  readonly isAuthenticated: boolean
  readonly register: (email: string, password: string) => Promise<void>
  readonly login: (email: string, password: string) => Promise<void>
  readonly logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
