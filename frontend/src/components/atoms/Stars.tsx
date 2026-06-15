import { Star } from 'lucide-react'

export interface StarsProps {
  readonly rating?: number
  readonly size?: number
}

export function Stars({ rating = 5, size = 16 }: Readonly<StarsProps>) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star
          key={i}
          className="fill-[oklch(0.78_0.16_85)] text-[oklch(0.78_0.16_85)]"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}
