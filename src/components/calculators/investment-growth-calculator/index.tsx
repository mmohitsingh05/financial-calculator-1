import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'initialInvestment', label: 'Initial Investment', type: 'currency', defaultValue: 10000, min: 0, max: 10000000 },
  { key: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: 500, min: 0, max: 100000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: 7, min: 0, max: 100, step: 0.1 },
  { key: 'years', label: 'Time Horizon', type: 'number', defaultValue: 10, min: 1, max: 60, suffix: 'years' },
  { key: 'inflationRate', label: 'Inflation Rate', type: 'percent', defaultValue: 3, min: 0, max: 20, step: 0.1 },
]

export function InvestmentGrowthCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ nominalFV: string; realFV: string; totalContributions: string; totalEarnings: string } | null>(null)
  const { values } = form

  function computeResult() {
    const monthly = values.monthlyContribution as number
    const years = values.years as number
    const initial = values.initialInvestment as number
    const annualRate = values.annualReturn as number
    const inflationRate = values.inflationRate as number

    const nominalFV = calculateFutureValue({
      presentValue: initial,
      annualRate,
      years,
      periodicContribution: monthly * 12,
    })
    const realFV = nominalFV / Math.pow(1 + inflationRate / 100, years)
    const totalContributions = initial + monthly * 12 * years
    const earnings = nominalFV - totalContributions
    return {
      nominalFV: formatCurrency(nominalFV),
      realFV: formatCurrency(realFV),
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Future Value (Nominal)" value={result.nominalFV} />
            <ResultsDisplay label="Future Value (Inflation-Adjusted)" value={result.realFV} highlight />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Total Earnings" value={result.totalEarnings} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}