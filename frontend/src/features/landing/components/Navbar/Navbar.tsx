import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navLinks } from "../../data/landing"
import { cn } from "@/lib/utils"

interface NavbarProps {
  readonly isAuthenticated: boolean
  readonly onNavigate: (path: string) => void
  readonly scrollTo: (id: string) => void
}

export function Navbar({
  isAuthenticated,
  onNavigate,
  scrollTo,
}: Readonly<NavbarProps>) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (target: string) => {
    setMenuOpen(false)
    scrollTo(target)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/25"
              whileHover={{ scale: 1.05 }}
            >
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              Obra<span className="text-primary">CTRL</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Button
                key={link.target}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(link.target)}
              >
                {link.label}
              </Button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                size="sm"
                onClick={() => onNavigate("/dashboard")}
              >
                Ir al dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("/login")}
                >
                  Iniciar sesión
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => onNavigate("/register")}
                >
                  Comenzar gratis
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.target}
                    variant="ghost"
                    size="sm"
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => handleNavClick(link.target)}
                  >
                    {link.label}
                  </Button>
                ))}
                <div className="pt-2 space-y-2">
                  {isAuthenticated ? (
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => onNavigate("/dashboard")}
                    >
                      Ir al dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full"
                        size="sm"
                        onClick={() => onNavigate("/login")}
                      >
                        Iniciar sesión
                      </Button>
                      <Button
                        variant="accent"
                        className="w-full"
                        size="sm"
                        onClick={() => onNavigate("/register")}
                      >
                        Comenzar gratis
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
