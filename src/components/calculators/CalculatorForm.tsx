import { type FieldDefinition, type CalculatorFormState } from './useCalculatorForm'
import { Input } from '@/components/ui/Input'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import { ResultsCard } from '@/components/ui/ResultsCard'
import { Button } from '@/components/ui/Button'

function NumbersIcon() {
  return (
    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )
}

function NumberInput({ field, value, error: isError, touched: isTouched, onChange }: {
  field: FieldDefinition
  value: number | string
  error?: string
  touched?: boolean
  onChange: (key: string, value: number | string) => void
}) {
  const prefix = field.type === 'currency' ? '$' : undefined
  const suffix = field.type === 'percent' ? '%' : field.suffix
  return (
    <Input
      label={field.label}
      name={field.key}
      type="number"
      value={value}
      onInput={(e: any) => onChange(field.key, parseFloat(e.currentTarget.value) || 0)}
      min={field.min}
      max={field.max}
      step={field.step ?? 'any'}
      placeholder={field.placeholder}
      prefix={prefix}
      suffix={suffix}
      error={isError}
      touched={isTouched}
    />
  )
}

function SliderInput({ field, value, onChange }: {
  field: FieldDefinition
  value: number | string
  onChange: (key: string, value: number | string) => void
}) {
  const numVal = typeof value === 'number' ? value : parseFloat(String(value)) || 0
  return (
    <Slider
      label={field.label}
      name={field.key}
      value={numVal}
      onInput={(e: any) => onChange(field.key, parseFloat(e.currentTarget.value))}
      min={field.min ?? 0}
      max={field.max ?? 100}
      step={field.step ?? 1}
      displayValue={field.suffix ? `${numVal}${field.suffix}` : String(numVal)}
      minLabel={field.min != null ? `${field.min}${field.suffix ?? ''}` : undefined}
      maxLabel={field.max != null ? `${field.max}${field.suffix ?? ''}` : undefined}
    />
  )
}

function SelectInput({ field, value, onChange }: {
  field: FieldDefinition
  value: number | string
  onChange: (key: string, value: number | string) => void
}) {
  return (
    <Select
      label={field.label}
      name={field.key}
      value={value}
      onChange={(e: any) => {
        const val = e.currentTarget.value
        onChange(field.key, isNaN(Number(val)) ? val : Number(val))
      }}
      options={field.options ?? []}
    />
  )
}

export { ResultsCard as ResultsDisplay }

interface CalculatorFormProps {
  fields: FieldDefinition[]
  values: CalculatorFormState
  displayValues?: CalculatorFormState
  errors: Record<string, string>
  touched: Record<string, boolean>
  onChange: (key: string, value: number | string) => void
  onCalculate: () => void
  onReset?: () => void
  calculateLabel?: string
  children?: any
}

export function CalculatorForm({
  fields,
  values,
  displayValues,
  errors,
  touched: isTouched,
  onChange,
  onCalculate,
  onReset,
  calculateLabel = 'Calculate',
  children,
}: CalculatorFormProps) {
  const display = displayValues || values
  let resultsRef: HTMLDivElement | null = null
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    onCalculate()
    setTimeout(() => {
      resultsRef?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <form onSubmit={handleSubmit} class="bg-card border border-border/80 rounded-2xl shadow-[--shadow-sm] p-5 md:p-6 space-y-5">
      <div class="flex items-center gap-2 mb-1">
        <span class="p-1.5 rounded-lg bg-primary/10 text-primary">
          <NumbersIcon />
        </span>
        <h3 class="font-semibold text-foreground text-sm">Enter Your Details</h3>
      </div>

      <div class="space-y-4">
        {fields.map(field => {
          if (field.type === 'select' && field.options) {
            return (
              <SelectInput
                key={field.key}
                field={field}
                value={display[field.key]}
                onChange={onChange}
              />
            )
          }
          if (field.type === 'range') {
            return (
              <SliderInput
                key={field.key}
                field={field}
                value={display[field.key]}
                onChange={onChange}
              />
            )
          }
          return (
            <NumberInput
              key={field.key}
              field={field}
              value={display[field.key]}
              error={errors[field.key]}
              touched={isTouched[field.key]}
              onChange={onChange}
            />
          )
        })}
      </div>

      <div class="flex gap-3 pt-2">
        <Button type="submit" variant="primary" size="md" class="flex-1">
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {calculateLabel}
        </Button>
        {onReset && (
          <Button type="button" variant="outline" size="md" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>

      {children && <div ref={el => resultsRef = el} class="animate-scale-in">{children}</div>}
    </form>
  )
}
