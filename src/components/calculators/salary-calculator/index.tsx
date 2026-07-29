import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { convertSalary, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'hourlyRate', label: 'Hourly Rate', type: 'currency', defaultValue: '', min: 0, max: 10000 },
  { key: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: '', min: 1, max: 168 },
  { key: 'weeksPerYear', label: 'Weeks per Year', type: 'number', defaultValue: '', min: 1, max: 52 },
]

interface SalaryResult {
  annual: string
  monthly: string
  biweekly: string
  weekly: string
  daily: string
}

export function SalaryCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<SalaryResult | null>(null)
  const { values } = form

  function computeResult(): SalaryResult {
    const hourlyRate = values.hourlyRate as number
    const hoursPerWeek = values.hoursPerWeek as number
    const weeksPerYear = values.weeksPerYear as number
    const converted = convertSalary(hourlyRate, hoursPerWeek, weeksPerYear)
    return {
      annual: formatCurrency(converted.annual),
      monthly: formatCurrency(converted.monthly),
      biweekly: formatCurrency(converted.biweekly),
      weekly: formatCurrency(converted.weekly),
      daily: formatCurrency(converted.daily),
    }
  }

  function handleCalculate() {
    if (form.validateAll()) setResult(computeResult())
  }

  function handleReset() {
    setResult(null)
    form.reset()
  }

  return (
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Convert">
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Salary Equivalents</h3>
          <ResultsDisplay label="Annual Salary" value={result.annual} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Monthly" value={result.monthly} />
            <ResultsDisplay label="Biweekly" value={result.biweekly} />
            <ResultsDisplay label="Weekly" value={result.weekly} />
            <ResultsDisplay label="Daily (5-day week)" value={result.daily} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
