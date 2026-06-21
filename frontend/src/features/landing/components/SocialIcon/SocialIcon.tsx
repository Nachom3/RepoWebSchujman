interface SocialIconProps {
  readonly d: string
  readonly label: string
}

export function SocialIcon({ d, label }: Readonly<SocialIconProps>) {
  return (
    <a
      href="#"
      className="w-9 h-9 bg-night-muted hover:bg-night-muted/80 rounded-lg flex items-center justify-center text-night-foreground/40 hover:text-night-foreground transition-colors"
      aria-label={label}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d={d} />
      </svg>
    </a>
  )
}
