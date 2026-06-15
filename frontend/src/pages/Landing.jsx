import { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  Star,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../context/auth-context'
import { Button } from '../components/atoms/Button'
import { cn } from '../lib/cn'

/* ── Helpers ── */
function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[oklch(0.78_0.16_85)] text-[oklch(0.78_0.16_85)]" />
      ))}
    </div>
  )
}

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, ease: 'easeOut' },
}

const stagger = (i) => ({ ...fadeInUp, transition: { ...fadeInUp.transition, delay: i * 0.1 } })

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ── Data ── */
  const problems = [
    {
      before: 'Llamás al capataz 5 veces por día para saber cómo viene la obra. No tenés datos objetivos, solo percepciones.',
      after: 'Dashboard en tiempo real con avance, fotos y novedades de cada obra. Sabés todo sin molestar a nadie.',
    },
    {
      before: 'Te quedás sin materiales un martes a las 10 AM. La obra se frena 3 días porque el proveedor no entrega.',
      after: 'Alertas de stock bajo y pedidos automáticos a proveedores. Los materiales llegan antes de que falten.',
    },
    {
      before: 'Cerrás el mes y descubrís que los costos reales superaron el presupuesto en un 18%. Demasiado tarde.',
      after: 'Comparación automática presupuesto vs. real por rubro. Desvíos detectados al instante, no a fin de mes.',
    },
  ]

  const useCases = [
    {
      num: 1, numClass: 'bg-primary', title: 'Control diario de obra',
      body: 'Una constructora con 8 obras activas en simultáneo usa ObraCTRL para que cada capataz registre avances, fotos y novedades desde el celu. El gerente ve todo en un panel sin pisar ninguna obra.',
      tags: ['Reportes diarios', 'Fotos', 'App móvil'], tagClass: 'bg-primary/10 text-primary',
    },
    {
      num: 2, numClass: 'bg-[oklch(0.65_0.2_40)]', title: 'Gestión de materiales',
      body: 'Una desarrolladora de countries maneja el inventario de 3 depósitos y 12 proveedores desde ObraCTRL. Cuando el stock de hierro baja del umbral mínimo, el sistema dispara el pedido automáticamente.',
      tags: ['Inventario', 'Proveedores', 'Alertas'], tagClass: 'bg-[oklch(0.65_0.2_40)]/10 text-[oklch(0.6_0.18_35)]',
    },
    {
      num: 3, numClass: 'bg-success', title: 'Rentabilidad por obra',
      body: 'El dueño de una constructora familiar usa ObraCTRL para ver la rentabilidad de cada obra en tiempo real: ingresos, costos reales, margen y proyección. Decide con datos, no con intuición.',
      tags: ['Dashboard', 'Presupuestos', 'Márgenes'], tagClass: 'bg-success/10 text-success',
    },
  ]

  const testimonials = [
    { quote: 'Antes de ObraCTRL manejábamos todo por WhatsApp y planillas. Ahora tengo el tablero de control en una pantalla y sé exactamente qué pasa en cada obra. Bajamos los sobrecostos un 9% en 3 meses.', initials: 'MG', name: 'Martín Gómez', role: 'Gerente General — Constructora Gómez Hnos.', avatarBg: 'bg-primary/15 text-primary' },
    { quote: 'El módulo de materiales nos cambió la vida. Antes teníamos faltantes cada dos semanas. Ahora las alertas nos avisan con tiempo y el sistema le pide al proveedor solo.', initials: 'CR', name: 'Carla Rodríguez', role: 'Jefa de Compras — Desarrollos del Litoral', avatarBg: 'bg-[oklch(0.65_0.2_40)]/15 text-[oklch(0.6_0.18_35)]' },
    { quote: 'Como dueño, antes decidía a ciegas. Ahora entro al dashboard, veo el margen de cada obra y sé exactamente dónde estamos ganando y dónde hay que apretar. Imprescindible.', initials: 'AL', name: 'Andrés Ledesma', role: 'Dueño — Ledesma Ingeniería', avatarBg: 'bg-success/15 text-success' },
  ]

  const navLinks = [
    { label: 'Funcionalidades', target: 'features' },
    { label: 'Casos de uso', target: 'use-cases' },
    { label: 'Demo', target: 'demo' },
    { label: 'Clientes', target: 'testimonials' },
  ]

  return (
    <div className="landing bg-surface text-surface-foreground">
      {/* ── Global landing CSS (pseudo-elements & patterns) ── */}
      <style>{`
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0%; height: 2px; background: var(--color-accent); transition: width 0.25s ease; }
        .nav-link:hover::after { width: 100%; }
        .dot-pattern { background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 24px 24px; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════ NAVBAR ═══ */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          scrolled ? 'bg-surface/95 backdrop-blur-md shadow-sm border-border' : 'bg-transparent border-transparent',
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
                <button
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  className="nav-link relative text-sm font-medium text-muted-foreground hover:text-surface-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                  Ir al dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </Button>
                  <Button variant="accent" size="sm" onClick={() => navigate('/register')}>
                    Comenzar gratis
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden border-t border-border"
              >
                <div className="py-4 space-y-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.target}
                      onClick={() => scrollTo(link.target)}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-surface-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="pt-2 space-y-2">
                    {isAuthenticated ? (
                      <Button variant="primary" fullWidth size="sm" onClick={() => navigate('/dashboard')}>
                        Ir al dashboard
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" fullWidth size="sm" onClick={() => navigate('/login')}>
                          Iniciar sesión
                        </Button>
                        <Button variant="accent" fullWidth size="sm" onClick={() => navigate('/register')}>
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

      {/* ═══════════════════════════════════════════════════════════════ HERO ═══ */}
      <section
        id="hero"
        className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--color-primary) 12%, transparent) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 50%)
          `,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div className="text-center lg:text-left" {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.65_0.2_40)]/10 border border-[oklch(0.65_0.2_40)]/30 text-[oklch(0.6_0.18_35)] text-xs font-semibold mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.65_0.2_40)]/40" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[oklch(0.65_0.2_40)]" />
                </span>
                Usado por +50 constructoras en Argentina
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Controlá tus obras{' '}
                <br className="hidden sm:block" />
                <span className="text-primary">sin perder el margen</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                El software que centraliza obras, materiales, presupuestos y comunicación en un solo lugar. Sabé qué pasa en cada obra antes de que te llamen.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Button variant="accent" size="lg" onClick={() => navigate('/dashboard')}>
                    Ir al dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="accent" size="lg" onClick={() => navigate('/register')}>
                      Agendar demo
                    </Button>
                    <Button variant="ghost" size="lg" onClick={() => scrollTo('features')}>
                      Ver funcionalidades
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                {['Sin instalación', 'Soporte 24/7', '14 días gratis'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end"
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
            >
              <motion.div
                className="relative w-full max-w-lg"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-2xl" />
                <div className="relative bg-surface rounded-2xl border border-border shadow-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-bold">ObraCTRL</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-success"
                        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                      <span className="text-xs text-muted-foreground">En vivo</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      ['Obras activas', '12', 'primary', 'primary-foreground'],
                      ['En término', '83%', 'success', 'success-foreground'],
                      ['Alertas', '3', 'danger', 'danger-foreground'],
                    ].map(([label, value, bg]) => (
                      <div key={label} className={`bg-${bg}/10 rounded-xl p-3 text-center`}>
                        <p className={`text-xs text-${bg} font-medium`}>{label}</p>
                        <p className={`text-xl font-bold text-${bg}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                      <span>Obra</span><span>Avance</span><span>Margen</span>
                    </div>
                    {[
                      ['Torre Norte', '78%', '+12%', 'success'],
                      ['Edificio Sur', '45%', '-3%', 'danger'],
                      ['Country Lomas', '92%', '+8%', 'success'],
                    ].map(([name, pct, margin, color]) => (
                      <div key={name} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-xs font-medium">
                        <span>{name}</span>
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: pct }} />
                        </div>
                        <span className={`text-${color}`}>{margin}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-1 h-14 pt-1">
                    {[40, 55, 35, 70, 60, 80, 50, 90, 65, 75, 55, 85].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t ${i === 4 || i === 7 ? 'bg-primary' : 'bg-primary/20'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground">Costo mensual por obra — últimos 12 meses</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-12 sm:h-16">
            <path d="M0 40 C240 80, 480 0, 720 40 C960 80, 1200 0, 1440 40 L1440 80 L0 80 Z" fill="var(--color-surface)" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ PROBLEM vs SOLUTION ═══ */}
      <section id="features" className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-[oklch(0.65_0.2_40)] uppercase tracking-wider">El problema</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Gestionar una constructora sin software{' '}
              <span className="text-primary">cuesta caro</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Los métodos tradicionales — llamadas, WhatsApp, planillas Excel — generan sobrecostos, demoras y decisiones a ciegas. ObraCTRL te da visibilidad total.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                className="group bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                {...stagger(i)}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 bg-danger/10 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <AlertTriangle className="w-5 h-5 text-danger" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-danger/70 uppercase tracking-wider mb-1">Sin ObraCTRL</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.before}</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 bg-success/10 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-success" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1">Con ObraCTRL</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-surface-foreground">{p.after.split('.')[0]}</strong>.{p.after.split('.').slice(1).join('.')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ USE CASES ═══ */}
      <section id="use-cases" className="py-20 lg:py-28 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Casos prácticos</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Así usan las constructoras{' '}
              <span className="text-primary">ObraCTRL</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                className="bg-surface rounded-2xl p-7 shadow-sm border border-border hover:shadow-md transition-shadow group"
                {...stagger(i)}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`flex-shrink-0 w-10 h-10 ${uc.numClass} text-white rounded-xl flex items-center justify-center text-lg font-bold`}>
                    {uc.num}
                  </span>
                  <h3 className="text-lg font-bold">{uc.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{uc.body}</p>
                <div className="flex flex-wrap gap-2">
                  {uc.tags.map((tag) => (
                    <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${uc.tagClass}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ DEMO ═══ */}
      <section id="demo" className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Demo interactiva</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Mirá ObraCTRL en acción
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Este es un vistazo al panel que usan los gerentes de obra todos los días. Datos reales, decisiones rápidas.
            </p>
          </motion.div>

          <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
            <div className="bg-night rounded-2xl shadow-2xl overflow-hidden border border-night-muted">
              <div className="flex items-center gap-2 px-5 py-3 bg-night-muted/50 border-b border-night-muted">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-night-foreground/40 font-medium">app.obractrl.com/dashboard</span>
              </div>
              <div className="p-5 sm:p-7 grid lg:grid-cols-3 gap-5">
                <div className="hidden lg:block space-y-1.5">
                  {[
                    { label: 'Dashboard', active: true },
                    { label: 'Obras' }, { label: 'Materiales' }, { label: 'Presupuestos' }, { label: 'Reportes' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                        item.active
                          ? 'bg-primary/20 text-primary-foreground'
                          : 'text-night-foreground/40 hover:text-night-foreground hover:bg-white/5',
                      )}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      ['Activas', '12', 'text-night-foreground'],
                      ['En término', '+83%', 'text-success'],
                      ['Margen prom.', '14%', 'text-primary'],
                      ['Alertas', '3', 'text-[oklch(0.65_0.2_40)]'],
                    ].map(([label, value, color]) => (
                      <div key={label} className="bg-night-muted rounded-xl p-3 text-center">
                        <p className="text-xs text-night-foreground/40 mb-1">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-night-muted rounded-xl p-4">
                    <p className="text-xs font-semibold text-night-foreground/40 uppercase tracking-wider mb-3">Últimas novedades</p>
                    <div className="space-y-2.5">
                      {[
                        { dot: 'bg-success', text: 'Torre Norte — Colocación de losa 3er piso completada', time: '10:32' },
                        { dot: 'bg-[oklch(0.65_0.2_40)]', text: 'Edificio Sur — Stock bajo de hierro Ø12 · Pedido emitido', time: '09:15' },
                        { dot: 'bg-primary', text: 'Country Lomas — Avance semanal registrado por capataz', time: 'Ayer' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                          <span className="text-night-foreground/70">{item.text}</span>
                          <span className="text-night-foreground/30 text-xs ml-auto">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Esta es una vista previa simulada.{' '}
              <button onClick={() => navigate('/register')} className="text-primary underline underline-offset-2 font-medium hover:text-primary-hover">
                Agendá una demo
              </button>{' '}
              para ver el producto real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-20 lg:py-28 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-[oklch(0.65_0.2_40)] uppercase tracking-wider">Testimonios</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Constructoras que ya{' '}
              <span className="text-primary">confían en ObraCTRL</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-surface rounded-2xl p-7 shadow-sm border border-border"
                {...stagger(i)}
              >
                <Stars />
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp}>
            <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              +50 constructoras ya usan ObraCTRL
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-30">
              {['Gómez Hnos.', 'Desarrollos del Litoral', 'Ledesma Ingeniería', 'Constructora Norte', 'Edificar SA'].map((name) => (
                <span key={name} className="text-xl font-bold">{name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ CTA FINAL ═══ */}
      <section className="relative py-20 lg:py-28 bg-night dot-pattern overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-night-foreground tracking-tight leading-tight">
              Dejá de gestionar obras{' '}
              <br className="hidden sm:block" />
              como en los 90
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-night-foreground/60 leading-relaxed max-w-xl mx-auto">
              Probá ObraCTRL gratis por 14 días. Sin compromiso, sin tarjeta de crédito. Implementación guiada y soporte 24/7.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Button variant="accent" size="lg" onClick={() => navigate('/dashboard')}>
                  Ir al dashboard
                </Button>
              ) : (
                <>
                  <Button variant="accent" size="lg" onClick={() => navigate('/register')} className="!shadow-xl !shadow-accent/20">
                    Agendar demo personalizada
                  </Button>
                  <Button variant="nightGhost" size="lg" onClick={() => navigate('/register')}>
                    Hablar con ventas
                  </Button>
                </>
              )}
            </div>
            <p className="mt-6 text-sm text-night-foreground/30">
              Sin compromiso · Cancelá cuando quieras · Datos seguros con encriptación JWT
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ FOOTER ═══ */}
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
                Software de gestión integral para empresas constructoras. Controlá tus obras, materiales y presupuestos desde un solo lugar.
              </p>
              <div className="flex items-center gap-4 mt-5">
                {[
                  { d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', label: 'LinkedIn' },
                  { d: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z', label: 'YouTube' },
                  { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', label: 'Twitter' },
                ].map(({ d, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-9 h-9 bg-night-muted hover:bg-night-muted/80 rounded-lg flex items-center justify-center text-night-foreground/40 hover:text-night-foreground transition-colors"
                    aria-label={label}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Producto', links: ['Funcionalidades', 'Demo', 'Precios', 'Actualizaciones'] },
              { title: 'Recursos', links: ['Documentación', 'API', 'Blog', 'Guías'] },
              { title: 'Empresa', links: ['Contacto', 'Términos', 'Privacidad', 'Seguridad'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-night-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-night-foreground/40 hover:text-night-foreground transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-night-muted flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-night-foreground/30">&copy; 2026 ObraCTRL. Todos los derechos reservados.</p>
            <p className="text-sm text-night-foreground/20">Hecho en Argentina 🇦🇷</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
