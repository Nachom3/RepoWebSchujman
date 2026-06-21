interface FooterColumnProps {
  readonly title: string
  readonly links: readonly string[]
}

export function FooterColumn({ title, links }: Readonly<FooterColumnProps>) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-night-foreground mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-sm text-night-foreground/40 hover:text-night-foreground transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
