import type { SocialLink } from '../../data/landing'

export interface SocialIconProps {
  readonly item: SocialLink
}

export function SocialIcon({ item }: Readonly<SocialIconProps>) {
  return (
    <a
      href="#"
      className="w-9 h-9 bg-night-muted hover:bg-night-muted/80 rounded-lg flex items-center justify-center text-night-foreground/40 hover:text-night-foreground transition-colors"
      aria-label={item.label}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d={item.d} />
      </svg>
    </a>
  )
}
