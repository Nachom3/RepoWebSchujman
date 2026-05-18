import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-surface text-surface-foreground">
        <p className="text-sm font-medium text-muted-foreground">
          Cargando sesión...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
