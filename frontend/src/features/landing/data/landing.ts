/* ── Typed data arrays extracted from Landing.tsx ── */

export interface Problem {
  readonly before: string
  readonly after: string
}

export interface UseCase {
  readonly num: number
  readonly numClass: string
  readonly title: string
  readonly body: string
  readonly tags: readonly string[]
  readonly tagClass: string
}

export interface Testimonial {
  readonly quote: string
  readonly initials: string
  readonly name: string
  readonly role: string
  readonly avatarBg: string
}

export interface NavLinkData {
  readonly label: string
  readonly target: string
}

export type MetricBg = 'primary' | 'success' | 'danger'
export type MetricFg = 'primary-foreground' | 'success-foreground' | 'danger-foreground'

export interface MetricItem {
  readonly label: string
  readonly value: string
  readonly bg: MetricBg
  readonly fg: MetricFg
}

export interface DashboardRowData {
  readonly name: string
  readonly pct: string
  readonly margin: string
  readonly color: MetricBg
}

export interface DemoNavItem {
  readonly label: string
  readonly active?: boolean
}

export interface ActivityItem {
  readonly dot: string
  readonly text: string
  readonly time: string
}

export interface SocialLink {
  readonly d: string
  readonly label: string
}

export interface FooterColumnData {
  readonly title: string
  readonly links: readonly string[]
}

export interface CompanyLogo {
  readonly name: string
}

/* ── Data arrays ── */

export const problems: readonly Problem[] = [
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

export const useCases: readonly UseCase[] = [
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

export const testimonials: readonly Testimonial[] = [
  { quote: 'Antes de ObraCTRL manejábamos todo por WhatsApp y planillas. Ahora tengo el tablero de control en una pantalla y sé exactamente qué pasa en cada obra. Bajamos los sobrecostos un 9% en 3 meses.', initials: 'MG', name: 'Martín Gómez', role: 'Gerente General — Constructora Gómez Hnos.', avatarBg: 'bg-primary/15 text-primary' },
  { quote: 'El módulo de materiales nos cambió la vida. Antes teníamos faltantes cada dos semanas. Ahora las alertas nos avisan con tiempo y el sistema le pide al proveedor solo.', initials: 'CR', name: 'Carla Rodríguez', role: 'Jefa de Compras — Desarrollos del Litoral', avatarBg: 'bg-[oklch(0.65_0.2_40)]/15 text-[oklch(0.6_0.18_35)]' },
  { quote: 'Como dueño, antes decidía a ciegas. Ahora entro al dashboard, veo el margen de cada obra y sé exactamente dónde estamos ganando y dónde hay que apretar. Imprescindible.', initials: 'AL', name: 'Andrés Ledesma', role: 'Dueño — Ledesma Ingeniería', avatarBg: 'bg-success/15 text-success' },
]

export const navLinks: readonly NavLinkData[] = [
  { label: 'Funcionalidades', target: 'features' },
  { label: 'Casos de uso', target: 'use-cases' },
  { label: 'Demo', target: 'demo' },
  { label: 'Clientes', target: 'testimonials' },
]

export const heroMetrics: readonly MetricItem[] = [
  { label: 'Obras activas', value: '12', bg: 'primary', fg: 'primary-foreground' },
  { label: 'En término', value: '83%', bg: 'success', fg: 'success-foreground' },
  { label: 'Alertas', value: '3', bg: 'danger', fg: 'danger-foreground' },
]

export const heroRows: readonly DashboardRowData[] = [
  { name: 'Torre Norte', pct: '78%', margin: '+12%', color: 'success' },
  { name: 'Edificio Sur', pct: '45%', margin: '-3%', color: 'danger' },
  { name: 'Country Lomas', pct: '92%', margin: '+8%', color: 'success' },
]

export const heroBarData: readonly number[] = [40, 55, 35, 70, 60, 80, 50, 90, 65, 75, 55, 85]

export const demoNavItems: readonly DemoNavItem[] = [
  { label: 'Dashboard', active: true },
  { label: 'Obras' },
  { label: 'Materiales' },
  { label: 'Presupuestos' },
  { label: 'Reportes' },
]

export const demoMetrics: readonly MetricItem[] = [
  { label: 'Activas', value: '12', bg: 'primary', fg: 'primary-foreground' },
  { label: 'En término', value: '+83%', bg: 'success', fg: 'success-foreground' },
  { label: 'Margen prom.', value: '14%', bg: 'primary', fg: 'primary-foreground' },
  { label: 'Alertas', value: '3', bg: 'danger', fg: 'danger-foreground' },
]

export const demoActivity: readonly ActivityItem[] = [
  { dot: 'bg-success', text: 'Torre Norte — Colocación de losa 3er piso completada', time: '10:32' },
  { dot: 'bg-[oklch(0.65_0.2_40)]', text: 'Edificio Sur — Stock bajo de hierro Ø12 · Pedido emitido', time: '09:15' },
  { dot: 'bg-primary', text: 'Country Lomas — Avance semanal registrado por capataz', time: 'Ayer' },
]

export const companyLogos: readonly CompanyLogo[] = [
  { name: 'Gómez Hnos.' },
  { name: 'Desarrollos del Litoral' },
  { name: 'Ledesma Ingeniería' },
  { name: 'Constructora Norte' },
  { name: 'Edificar SA' },
]

export const socialLinks: readonly SocialLink[] = [
  { d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', label: 'LinkedIn' },
  { d: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z', label: 'YouTube' },
  { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', label: 'Twitter' },
]

export const footerColumns: readonly FooterColumnData[] = [
  { title: 'Producto', links: ['Funcionalidades', 'Demo', 'Precios', 'Actualizaciones'] },
  { title: 'Recursos', links: ['Documentación', 'API', 'Blog', 'Guías'] },
  { title: 'Empresa', links: ['Contacto', 'Términos', 'Privacidad', 'Seguridad'] },
]
