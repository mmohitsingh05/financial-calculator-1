import { type FieldDefinition, type CalculatorFormState } from './useCalculatorForm'

interface NumberInputProps {
  field: FieldDefinition
  value: number | string
  error?: string
  touched?: boolean
  onChange: (key: string, value: number | string) => void
}

export function NumberInput({ field, value, error, touched: isTouched, onChange }: NumberInputProps) {
  const showError = isTouched && error
  return (
    <div class="space-y-1.5">
      <label class="block text-sm font-medium text-foreground" for={field.key}>
        {field.label}
      </label>
      <div class="relative">
        {field.type === 'currency' && (
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
        )}
        <input
          id={field.key}
          type="number"
          value={value}
          onInput={(e: any) => onChange(field.key, parseFloat(e.currentTarget.value) || 0)}
          min={field.min}
          max={field.max}
          step={field.step ?? 'any'}
          placeholder={field.placeholder}
          class={`w-full rounded-lg border ${showError ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${field.type === 'currency' ? 'pl-7' : ''}`}
        />
        {field.suffix && (
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{field.suffix}</span>
        )}
      </div>
      {showError && <p class="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface SliderInputProps {
  field: FieldDefinition
  value: number | string
  onChange: (key: string, value: number | string) => void
}

export function SliderInput({ field, value, onChange }: SliderInputProps) {
  const numVal = typeof value === 'number' ? value : parseFloat(String(value)) || 0
  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-foreground" for={field.key}>
          {field.label}
        </label>
        <span class="text-sm font-semibold text-primary">{field.suffix ? `${numVal}${field.suffix}` : numVal}</span>
      </div>
      <input
        id={field.key}
        type="range"
        value={numVal}
        onInput={(e: any) => onChange(field.key, parseFloat(e.currentTarget.value))}
        min={field.min ?? 0}
        max={field.max ?? 100}
        step={field.step ?? 1}
        class="w-full accent-primary"
      />
    </div>
  )
}

interface SelectInputProps {
  field: FieldDefinition
  value: number | string
  onChange: (key: string, value: number | string) => void
}

export function SelectInput({ field, value, onChange }: SelectInputProps) {
  return (
    <div class="space-y-1.5">
      <label class="block text-sm font-medium text-foreground" for={field.key}>
        {field.label}
      </label>
      <select
        id={field.key}
        value={value}
        onChange={(e: any) => {
          const val = e.currentTarget.value
          onChange(field.key, isNaN(Number(val)) ? val : Number(val))
        }}
        class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {field.options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface ResultsDisplayProps {
  label: string
  value: string
  highlight?: boolean
}

export function ResultsDisplay({ label, value, highlight }: ResultsDisplayProps) {
  return (
    <div class={`p-3 rounded-lg ${highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}>
      <p class="text-xs text-muted-foreground">{label}</p>
      <p class={`text-lg font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  )
}

interface CalculatorFormProps {
  fields: FieldDefinition[]
  values: CalculatorFormState
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
  errors,
  touched: isTouched,
  onChange,
  onCalculate,
  onReset,
  calculateLabel = 'Calculate',
  children,
}: CalculatorFormProps) {
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    onCalculate()
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {fields.map(field => {
        if (field.type === 'select' && field.options) {
          return (
            <SelectInput
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={onChange}
            />
          )
        }
        if (field.type === 'range') {
          return (
            <SliderInput
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={onChange}
            />
          )
        }
        return (
          <NumberInput
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            touched={isTouched[field.key]}
            onChange={onChange}
          />
        )
      })}

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          class="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          {calculateLabel}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            class="px-4 py-2.5 rounded-lg border border-border text-muted-foreground text-sm hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {children}
    </form>
  )
}