import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/components/ProtectedRoute"
import { PortalGate } from "@/features/portal/components/PortalGate"
import Dashboard from "@/pages/Dashboard"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Register from "@/pages/Register"
import Clientes from "@/pages/Clientes"
import ClienteDetail from "@/pages/ClienteDetail"
import Pedidos from "@/pages/Pedidos"
import PedidoDetailPage from "@/pages/PedidoDetail"
import Inventario from "@/pages/Inventario"
import Flota from "@/pages/Flota"
import Panel from "@/pages/Panel"
import Portal from "@/pages/Portal"
import PortalLogin from "@/pages/PortalLogin"
import PortalOrders from "@/pages/PortalOrders"
import PortalNewOrder from "@/pages/PortalNewOrder"
import PortalTrack from "@/pages/PortalTrack"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes/:id"
        element={
          <ProtectedRoute>
            <ClienteDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <Pedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos/:id"
        element={
          <ProtectedRoute>
            <PedidoDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario"
        element={
          <ProtectedRoute>
            <Inventario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flota"
        element={
          <ProtectedRoute>
            <Flota />
          </ProtectedRoute>
        }
      />
      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }
      />
      <Route path="/portal" element={<Portal />} />
      <Route path="/portal/login" element={<PortalLogin />} />
      <Route
        path="/portal/orders"
        element={
          <PortalGate>
            <PortalOrders />
          </PortalGate>
        }
      />
      <Route
        path="/portal/orders/new"
        element={
          <PortalGate>
            <PortalNewOrder />
          </PortalGate>
        }
      />
      <Route
        path="/portal/orders/:id"
        element={
          <PortalGate>
            <PortalTrack />
          </PortalGate>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
