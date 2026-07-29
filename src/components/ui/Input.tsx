import { cn } from '@/lib/cn'
import type { JSX } from 'preact'

interface InputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  touched?: boolean
  prefix?: string
  suffix?: string
  wrapperClass?: string
}

export function Input({
  label,
  error,
  touched,
  prefix,
  suffix,
  class: className,
  wrapperClass,
  id,
  ...props
}: InputProps) {
  const showError = touched && error
  const inputId = id || props.name

  return (
    <div class={cn('space-y-1.5', wrapperClass)}>
      {label && (
        <label class="block text-sm font-medium text-foreground" for={inputId}>
          {label}
        </label>
      )}
      <div class="relative">
        {prefix && (
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          class={cn(
            'w-full rounded-xl border text-sm text-foreground placeholder:text-muted-foreground',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4 focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted',
            'tabular-nums',
            'h-10 px-3.5',
            showError
              ? 'border-destructive bg-destructive/5 focus:ring-destructive/20 focus:border-destructive'
              : 'border-input/80 bg-muted/70 hover:bg-muted/90 hover:border-input focus:bg-background focus:ring-primary/15',
            prefix && 'pl-8',
            suffix && 'pr-10',
            props.type === 'number' && '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            props.type === 'number' && '[-moz-appearance:textfield]',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {showError && (
        <p class="text-xs text-destructive flex items-center gap-1">
          <svg class="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
