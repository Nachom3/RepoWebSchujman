import { Link, useLocation } from "react-router-dom"

import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  Package,
  Truck,
  HardHat,
  ListChecks,
  Wallet,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Obras", href: "/proyectos", icon: Building2 },
  { label: "Presupuestos", href: "/presupuestos", icon: FileSpreadsheet },
  { label: "Materiales", href: "/materiales", icon: Package },
  { label: "Proveedores", href: "/proveedores", icon: Truck },
  { label: "Personal", href: "/personal", icon: HardHat },
  { label: "Tareas", href: "/tareas", icon: ListChecks },
  { label: "Pagos", href: "/pagos", icon: Wallet },
  { label: "Panel", href: "/panel", icon: BarChart3 },
] as const

interface AppSidebarProps {
  readonly collapsed?: boolean
  readonly onToggle?: () => void
  readonly className?: string
}

export function AppSidebar({ collapsed = false, onToggle, className }: Readonly<AppSidebarProps>) {
  const location = useLocation()

  return (
    <aside
      data-slot="app-sidebar"
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-4">
        <Building2 className="size-6 shrink-0 text-sidebar-primary" />
        {!collapsed && (
          <span className="text-lg font-black tracking-tight text-sidebar-foreground">
            Constructora
          </span>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Collapse toggle */}
      <div className="flex items-center justify-center p-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>
    </aside>
  )
}
