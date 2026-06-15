import type { FooterColumnData } from '../../data/landing'

export interface FooterColumnProps {
  readonly column: FooterColumnData
}

export function FooterColumn({ column }: Readonly<FooterColumnProps>) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-night-foreground mb-4">{column.title}</h4>
      <ul className="space-y-2.5">
        {column.links.map((link) => (
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
