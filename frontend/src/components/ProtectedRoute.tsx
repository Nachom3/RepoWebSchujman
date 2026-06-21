import { Navigate } from "react-router-dom"

import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  readonly children: React.ReactNode
}

export default function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
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
