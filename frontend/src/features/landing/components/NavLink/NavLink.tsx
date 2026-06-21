interface NavLinkProps {
  readonly label: string
  readonly target: string
  readonly onClick: (target: string) => void
  readonly className?: string
}

export function NavLink({ label, target, onClick, className }: Readonly<NavLinkProps>) {
  return (
    <button
      onClick={() => onClick(target)}
      className={
        className ??
        "nav-link relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      }
    >
      {label}
    </button>
  )
}
