import { Outlet, useLocation } from "react-router-dom"

import { DashboardLayout } from "../DashboardLayout/DashboardLayout"

function getAdminRouteTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname === "/clientes/new") return "Nuevo cliente"
  if (pathname === "/clientes") return "Clientes"
  if (pathname.startsWith("/clientes/")) return "Detalle del cliente"
  if (pathname === "/proyectos") return "Obras"
  if (pathname.startsWith("/proyectos/")) return "Detalle de la obra"
  if (pathname === "/presupuestos") return "Presupuestos"
  if (pathname === "/materiales") return "Materiales"
  if (pathname === "/proveedores") return "Proveedores"
  if (pathname === "/personal") return "Personal"
  if (pathname === "/tareas") return "Tareas"
  if (pathname === "/pagos") return "Pagos"
  if (pathname === "/panel") return "Panel"

  return "Dashboard"
}

export function AdminLayoutRoute() {
  const location = useLocation()

  return (
    <DashboardLayout title={getAdminRouteTitle(location.pathname)}>
      <Outlet />
    </DashboardLayout>
  )
}
