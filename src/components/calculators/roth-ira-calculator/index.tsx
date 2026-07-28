import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'
import contributionLimits from '@/data/contributionLimits2026.json'

const fields: FieldDefinition[] = [
  { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 80, suffix: 'years' },
  { key: 'currentBalance', label: 'Current Balance', type: 'currency', defaultValue: 0, min: 0, max: 10000000 },
  { key: 'annualContribution', label: 'Annual Contribution', type: 'currency', defaultValue: 7000, min: 0, max: 7000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: 7, min: 0, max: 100, step: 0.1 },
  { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 65, min: 30, max: 100, suffix: 'years' },
]

export function RothIRACalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{futureValue: string; totalContributions: string; totalEarnings: string} | null>(null)
  const { values } = form

  function computeResult() {
    const limit = (contributionLimits as any).rothIRALimit || 7000
    const years = (values.retirementAge as number) - (values.currentAge as number)
    const cappedContribution = Math.min(values.annualContribution as number, limit)
    const fv = calculateFutureValue({
      presentValue: values.currentBalance as number,
      annualRate: values.annualReturn as number,
      years,
      periodicContribution: cappedContribution,
    })
    const totalContributions = cappedContribution * years + (values.currentBalance as number)
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
    <CalculatorForm fields={fields} values={values} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset}>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Balance at Retirement" value={result.futureValue} highlight />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Total Earnings (Tax-Free)" value={result.totalEarnings} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
