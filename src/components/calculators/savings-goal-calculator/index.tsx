import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveSavingsPayment, calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'targetAmount', label: 'Target Amount', type: 'currency', defaultValue: 50000, min: 0, max: 100000000 },
  { key: 'currentSavings', label: 'Current Savings', type: 'currency', defaultValue: 5000, min: 0, max: 10000000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: 5, min: 0, max: 100, step: 0.1 },
  { key: 'years', label: 'Years to Goal', type: 'number', defaultValue: 5, min: 1, max: 60, suffix: 'years' },
]

export function SavingsGoalCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ monthlySavings: string; totalContributions: string; totalEarnings: string } | null>(null)
  const { values } = form

  function computeResult() {
    const monthlyPMT = solveSavingsPayment({
      targetFV: values.targetAmount as number,
      annualRate: values.annualReturn as number,
      years: values.years as number,
      currentBalance: values.currentSavings as number,
    })
    const years = values.years as number
    const totalContributions = (values.currentSavings as number) + monthlyPMT * 12 * years
    const fvAtGoal = calculateFutureValue({
      presentValue: values.currentSavings as number,
      annualRate: values.annualReturn as number,
      years,
      periodicContribution: monthlyPMT * 12,
    })
    const earnings = fvAtGoal - totalContributions
    return {
      monthlySavings: formatCurrency(monthlyPMT),
      totalContributions: formatCurrency(totalContributions),
      totalEarnings: formatCurrency(earnings),
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
          <h3 class="text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Monthly Savings Needed" value={result.monthlySavings} highlight />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Total Earnings" value={result.totalEarnings} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}