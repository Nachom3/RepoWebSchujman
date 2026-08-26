import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { ErrorBoundary } from "@/components/ErrorBoundary"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/context/AuthContext"
import { PortalProvider, usePortalSession } from "@/context/PortalContext"
import { AdminLayoutRoute } from "@/features/dashboard"
import {
  PortalHome,
  PortalLogin,
  PortalProjectDetailView,
} from "@/features/portal-cliente"

import Dashboard from "@/pages/Dashboard"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Register from "@/pages/Register"
import Clientes from "@/pages/Clientes"
import ClienteDetail from "@/pages/ClienteDetail"
import ClienteNew from "@/pages/ClienteNew"
import Proyectos from "@/pages/Proyectos"
import ProyectoDetail from "@/pages/ProyectoDetail"
import Materiales from "@/pages/Materiales"
import Proveedores from "@/pages/Proveedores"
import Personal from "@/pages/Personal"
import Tareas from "@/pages/Tareas"
import Presupuestos from "@/pages/Presupuestos"
import Pagos from "@/pages/Pagos"
import Panel from "@/pages/Panel"

import "./global.css"

function PortalRoot() {
  const { isAuthenticated, session, login, logout } = usePortalSession()
  if (!isAuthenticated || !session) {
    return (
      <PortalLogin
        onLogin={(token, client) =>
          login({ sessionToken: token, client })
        }
      />
    )
  }
  return <PortalHome session={session} onLogout={logout} />
}

function PortalProjectDetailRoute() {
  const { session } = usePortalSession()
  if (!session) return <Navigate to="/portal/login" replace />
  return <PortalProjectDetailView session={session} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayoutRoute />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/new" element={<ClienteNew />} />
        <Route path="/clientes/:id" element={<ClienteDetail />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/proyectos/:id" element={<ProyectoDetail />} />
        <Route path="/presupuestos" element={<Presupuestos />} />
        <Route path="/materiales" element={<Materiales />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/panel" element={<Panel />} />
      </Route>

      <Route path="/portal" element={<PortalRoot />} />
      <Route path="/portal/login" element={<PortalRoot />} />
      <Route path="/portal/obras/:id" element={<PortalProjectDetailRoute />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AuthProvider>
            <PortalProvider>
              <App />
            </PortalProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ErrorBoundary>
  </StrictMode>,
)
