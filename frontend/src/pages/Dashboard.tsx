import { useAuth } from "@/context/auth-context"
import { DashboardView } from "@/features/dashboard"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <DashboardView email={user?.email ?? ""} onLogout={logout} />
  )
}
