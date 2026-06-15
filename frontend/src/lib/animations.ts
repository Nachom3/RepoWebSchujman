/* ── Animation helpers for framer-motion ── */

interface Transition {
  readonly duration: number
  readonly ease: readonly [number, number, number, number]
  readonly delay?: number
}

export interface FadeInUpProps {
  readonly initial: { readonly opacity: number; readonly y: number }
  readonly whileInView: { readonly opacity: number; readonly y: number }
  readonly viewport: { readonly once: boolean; readonly margin: string }
  readonly transition: Transition
}

export const fadeInUp: FadeInUpProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
}

export function stagger(index: number): FadeInUpProps {
  return {
    ...fadeInUp,
    transition: { ...fadeInUp.transition, delay: index * 0.1 },
  }
}
