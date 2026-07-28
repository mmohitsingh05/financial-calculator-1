import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateHourlyToSalary, convertSalary, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'hourlyRate', label: 'Hourly Rate', type: 'currency', defaultValue: 25, min: 1, max: 500 },
  { key: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: 40, min: 1, max: 80 },
  { key: 'weeksPerYear', label: 'Weeks per Year', type: 'number', defaultValue: 52, min: 1, max: 52 },
  { key: 'overtimeHours', label: 'Overtime Hours per Week', type: 'number', defaultValue: 0, min: 0, max: 40 },
]

export function HourlyToSalaryCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const rate = values.hourlyRate as number
    const hpw = values.hoursPerWeek as number
    const wpy = values.weeksPerYear as number
    const ot = values.overtimeHours as number
    const annual = rate * hpw * wpy
    const salary = convertSalary(rate, hpw, wpy)
    const hourlyResult = calculateHourlyToSalary(annual, hpw, wpy, ot)
    return {
      annualSalary: formatCurrency(annual),
      monthly: formatCurrency(salary.monthly),
      biweekly: formatCurrency(salary.biweekly),
      weekly: formatCurrency(salary.weekly),
      hourlyRate: formatCurrency(rate),
      overtimeRate: formatCurrency(hourlyResult.overtimeRate),
      weeklyPayWithOT: formatCurrency(hourlyResult.weeklyPay),
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
    <CalculatorForm fields={fields} values={values} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset}>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Annual Salary</h3>
          <ResultsDisplay label="Annual Salary" value={result.annualSalary} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Monthly Pay" value={result.monthly} />
            <ResultsDisplay label="Bi-Weekly Pay" value={result.biweekly} />
            <ResultsDisplay label="Weekly Pay" value={result.weekly} />
          </div>
          <h3 class="text-lg font-semibold text-foreground pt-3">Rate Breakdown</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Hourly Rate" value={result.hourlyRate} />
            <ResultsDisplay label="Overtime Rate (1.5x)" value={result.overtimeRate} />
            <ResultsDisplay label="Weekly Pay with OT" value={result.weeklyPayWithOT} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}