import { Link } from "react-router-dom"
import { Building2 } from "lucide-react"

import { socialLinks, footerColumns } from "../../data/landing"
import { SocialIcon } from "../SocialIcon"
import { FooterColumn } from "../FooterColumn"

export function Footer() {
  return (
    <footer className="bg-[oklch(0.15_0.02_260)] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-night-foreground tracking-tight">
                Obra<span className="text-primary">CTRL</span>
              </span>
            </Link>
            <p className="text-sm text-night-foreground/40 leading-relaxed max-w-xs">
              Software de gestión integral para empresas constructoras.
              Controlá tus obras, materiales y presupuestos desde un solo lugar.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {socialLinks.map((item) => (
                <SocialIcon key={item.label} d={item.d} label={item.label} />
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <FooterColumn
              key={col.title}
              title={col.title}
              links={col.links}
            />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-night-muted flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-night-foreground/30">
            &copy; 2026 ObraCTRL. Todos los derechos reservados.
          </p>
          <p className="text-sm text-night-foreground/20">
            Hecho en Argentina 🇦🇷
          </p>
        </div>
      </div>
    </footer>
  )
}
