import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { AppSidebar } from "../AppSidebar/AppSidebar"

interface DashboardLayoutProps {
  readonly title: string
  readonly children: React.ReactNode
}

export function DashboardLayout({ title, children }: Readonly<DashboardLayoutProps>) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-40 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" showCloseButton={false} className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onToggle={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-3 md:pl-0">
            {/* Spacer for mobile hamburger */}
            <div className="w-8 md:hidden" />
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <motion.main
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
