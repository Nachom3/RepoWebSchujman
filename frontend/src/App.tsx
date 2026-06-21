import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/components/ProtectedRoute"
import Dashboard from "@/pages/Dashboard"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Register from "@/pages/Register"
import Clientes from "@/pages/Clientes"
import ClienteDetail from "@/pages/ClienteDetail"

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
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
