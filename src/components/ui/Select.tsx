import { cn } from '@/lib/cn'
import type { JSX } from 'preact'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends JSX.HTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  wrapperClass?: string
}

export function Select({
  label,
  options,
  placeholder,
  class: className,
  wrapperClass,
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name

  return (
    <div class={cn('space-y-1.5', wrapperClass)}>
      {label && (
        <label class="block text-sm font-medium text-foreground" for={selectId}>
          {label}
        </label>
      )}
      <div class="relative">
        <select
          id={selectId}
          class={cn(
            'w-full rounded-xl border border-input/80 bg-muted/70 px-3.5 py-2.5 pr-10 text-sm text-foreground',
            'transition-all duration-200 appearance-none',
            'hover:bg-muted/90 hover:border-input focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary focus:bg-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 9l6 6l6-6" />
        </svg>
      </div>
    </div>
  )
}
