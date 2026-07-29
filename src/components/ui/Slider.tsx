import { cn } from '@/lib/cn'
import type { JSX } from 'preact'

interface SliderProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  displayValue?: string
  minLabel?: string
  maxLabel?: string
}

export function Slider({
  label,
  displayValue,
  minLabel,
  maxLabel,
  class: className,
  id,
  ...props
}: SliderProps) {
  const sliderId = id || props.name

  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        {label && (
          <label class="block text-sm font-medium text-foreground" for={sliderId}>
            {label}
          </label>
        )}
        {displayValue && (
          <span class="text-sm font-semibold text-primary tabular-nums">
            {displayValue}
          </span>
        )}
      </div>
      <input
        id={sliderId}
        type="range"
        class={cn(
          'w-full h-2 rounded-full appearance-none cursor-pointer bg-muted/80 accent-primary',
          'transition-all duration-150',
          'hover:bg-muted',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full',
        '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[--shadow-md]',
        '[&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200',
        '[&::-webkit-slider-thumb]:active:scale-95',
        'touch-manipulation',
        '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full',
        '[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0',
        '[&::-moz-range-thumb]:shadow-[--shadow-md]',
          className,
        )}
        {...props}
      />
      {(minLabel || maxLabel) && (
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>{minLabel || props.min}</span>
          <span>{maxLabel || props.max}</span>
        </div>
      )}
    </div>
  )
}
