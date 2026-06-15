import { motion } from 'framer-motion'
import { stagger } from '../../lib/animations'
import { Card } from './Card'
import type { UseCase } from '../../data/landing'

const numClassMap: Record<string, string> = {
  'bg-primary': 'bg-primary',
  'bg-[oklch(0.65_0.2_40)]': 'bg-[oklch(0.65_0.2_40)]',
  'bg-success': 'bg-success',
}

const tagClassMap: Record<string, string> = {
  'bg-primary/10 text-primary': 'bg-primary/10 text-primary',
  'bg-[oklch(0.65_0.2_40)]/10 text-[oklch(0.6_0.18_35)]':
    'bg-[oklch(0.65_0.2_40)]/10 text-[oklch(0.6_0.18_35)]',
  'bg-success/10 text-success': 'bg-success/10 text-success',
}

export interface UseCaseCardProps {
  readonly item: UseCase
  readonly index: number
}

export function UseCaseCard({ item, index }: Readonly<UseCaseCardProps>) {
  const numClass = numClassMap[item.numClass] ?? item.numClass
  const tagClass = tagClassMap[item.tagClass] ?? item.tagClass

  return (
    <motion.div
      className="group"
      {...stagger(index)}
    >
      <Card surface="solid" padding="md" className="!rounded-2xl !p-7 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-5">
          <span
            className={`flex-shrink-0 w-10 h-10 ${numClass} text-white rounded-xl flex items-center justify-center text-lg font-bold`}
          >
            {item.num}
          </span>
          <h3 className="text-lg font-bold">{item.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.body}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${tagClass}`}>
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
