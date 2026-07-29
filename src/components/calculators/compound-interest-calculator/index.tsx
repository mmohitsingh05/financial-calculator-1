import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'initialDeposit', label: 'Initial Deposit', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'interestRate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'years', label: 'Time Horizon', type: 'number', defaultValue: '', min: 1, max: 60, suffix: 'years' },
  { key: 'compoundFrequency', label: 'Compound Frequency', type: 'select', defaultValue: 12, options: [
    { label: 'Daily (365)', value: 365 },
    { label: 'Monthly (12)', value: 12 },
    { label: 'Quarterly (4)', value: 4 },
    { label: 'Annually (1)', value: 1 },
  ]},
]

export function CompoundInterestCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{futureValue: string; totalContributions: string; totalEarnings: string} | null>(null)
  const { values } = form

  function computeResult() {
    const fv = calculateFutureValue({
      presentValue: values.initialDeposit as number,
      annualRate: values.interestRate as number,
      years: values.years as number,
      compoundingFrequency: values.compoundFrequency as any,
      periodicContribution: (values.monthlyContribution as number) * 12,
    })
    const totalContributions = (values.initialDeposit as number) + (values.monthlyContribution as number) * 12 * (values.years as number)
    return {
      futureValue: formatCurrency(fv),
      totalContributions: formatCurrency(totalContributions),
      totalEarnings: formatCurrency(fv - totalContributions),
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset}>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Future Value" value={result.futureValue} highlight />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Total Earnings" value={result.totalEarnings} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
