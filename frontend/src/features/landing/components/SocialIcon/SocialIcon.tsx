import { Button } from "@/components/ui/button"

interface SocialIconProps {
  readonly d: string
  readonly label: string
}

export function SocialIcon({ d, label }: Readonly<SocialIconProps>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      aria-label={label}
      className="text-night-foreground/40 hover:text-night-foreground hover:bg-night-muted"
    >
      <a href="#">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d={d} />
        </svg>
      </a>
    </Button>
  )
}
