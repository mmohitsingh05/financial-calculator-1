import { cn } from '@/lib/cn'

interface ResultsCardProps {
  label: string
  value: string
  highlight?: boolean
  class?: string
}

export function ResultsCard({ label, value, highlight, class: className }: ResultsCardProps) {
  return (
    <div
      class={cn(
        'p-3 sm:p-4 rounded-xl',
        highlight
          ? 'bg-gradient-to-br from-primary/[0.05] via-primary/[0.02] to-muted border border-primary/20 shadow-[--shadow-sm]'
          : 'bg-muted/70 border border-border/70',
        className,
      )}
    >
      <p class="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{label}</p>
      <p class={cn(
        highlight ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl',
        'font-bold tabular-nums leading-tight',
        highlight ? 'text-primary' : 'text-foreground',
      )}>
        {value}
      </p>
    </div>
  )
}
