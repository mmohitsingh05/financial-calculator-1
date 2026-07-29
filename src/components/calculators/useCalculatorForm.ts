import { useState, useCallback } from 'preact/hooks'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/CalculatorEngine'

export interface FieldDefinition {
  key: string
  label: string
  type: 'number' | 'currency' | 'percent' | 'select' | 'range'
  defaultValue: number | string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  options?: { label: string; value: string | number }[]
  suffix?: string
}

export interface CalculatorFormState {
  [key: string]: number | string
}

export function useCalculatorForm(fields: FieldDefinition[]) {
  const initial: CalculatorFormState = {}
  for (const f of fields) {
    initial[f.key] = f.defaultValue
  }

  const [rawValues, setRawValues] = useState<CalculatorFormState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const values: CalculatorFormState = {}
  for (const [key, val] of Object.entries(rawValues)) {
    values[key] = val === '' ? 0 : val
  }

  const displayValues: CalculatorFormState = {}
  for (const [key, val] of Object.entries(rawValues)) {
    displayValues[key] = val
  }

  const setValue = useCallback((key: string, value: number | string) => {
    setRawValues(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const validate = useCallback((field: FieldDefinition): string | null => {
    const val = values[field.key]
    if (typeof val === 'number') {
      if (isNaN(val)) return 'Please enter a valid number'
      if (field.min !== undefined && val < field.min) return `Minimum value is ${field.min}`
      if (field.max !== undefined && val > field.max) return `Maximum value is ${field.max}`
    }
    return null
  }, [values])

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    let valid = true
    for (const field of fields) {
      const err = validate(field)
      if (err) {
        newErrors[field.key] = err
        valid = false
      }
    }
    setErrors(newErrors)
    setTouched(Object.fromEntries(fields.map(f => [f.key, true])))
    return valid
  }, [fields, validate])

  const reset = useCallback(() => {
    const init: CalculatorFormState = {}
    for (const f of fields) {
      init[f.key] = f.defaultValue
    }
    setRawValues(init)
    setErrors({})
    setTouched({})
  }, [fields])

  const formatValue = useCallback((key: string, fieldType: string): string => {
    const val = values[key]
    if (typeof val !== 'number') return String(val)
    switch (fieldType) {
      case 'currency': return formatCurrency(val)
      case 'percent': return formatPercent(val)
      default: return formatNumber(val)
    }
  }, [values])

  return {
    values,
    displayValues,
    errors,
    touched,
    setValue,
    validate,
    validateAll,
    reset,
    formatValue,
  }
}
