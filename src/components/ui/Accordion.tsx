import { useState } from 'preact/hooks'
import { cn } from '@/lib/cn'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  class?: string
}

export function Accordion({ items, class: className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div class={cn('space-y-3', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            class="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200"
            classList={{ 'border-primary/20 shadow-[--shadow-sm]': isOpen }}
          >
            <button
              onClick={() => toggle(i)}
              class="flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                class={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-2',
                  isOpen && 'rotate-180 text-primary',
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div
              class={cn(
                'grid transition-all duration-200 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div class="overflow-hidden">
                <div class="px-4 pb-3.5 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
