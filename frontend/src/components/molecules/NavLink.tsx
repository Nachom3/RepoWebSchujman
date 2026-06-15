import type { NavLink as NavLinkData } from '../../data/landing'

export interface NavLinkProps {
  readonly item: NavLinkData
  readonly onClick: (target: string) => void
  readonly className?: string
}

export function NavLink({ item, onClick, className }: Readonly<NavLinkProps>) {
  return (
    <button
      onClick={() => onClick(item.target)}
      className={
        className ??
        'nav-link relative text-sm font-medium text-muted-foreground hover:text-surface-foreground transition-colors'
      }
    >
      {item.label}
    </button>
  )
}
