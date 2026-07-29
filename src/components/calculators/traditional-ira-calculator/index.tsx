import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'
import contributionLimits from '@/data/contributionLimits2026.json'

const limit = (contributionLimits as any).rothIRALimit || 7000

const fields: FieldDefinition[] = [
  { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: '', min: 18, max: 80, suffix: 'years' },
  { key: 'currentBalance', label: 'Current Balance', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'annualContribution', label: 'Annual Contribution', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: '', min: 50, max: 90, suffix: 'years' },
  { key: 'currentTaxRate', label: 'Current Tax Rate', type: 'percent', defaultValue: '', min: 0, max: 50, step: 0.5 },
  { key: 'expectedRetirementTaxRate', label: 'Expected Retirement Tax Rate', type: 'percent', defaultValue: '', min: 0, max: 50, step: 0.5 },
]

export function TraditionalIRACalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ balanceAtRetirement: string; afterTaxValue: string; totalContributions: string; totalEarnings: string } | null>(null)
  const { values } = form

  function computeResult() {
    const years = (values.retirementAge as number) - (values.currentAge as number)
    const cappedContribution = Math.min(values.annualContribution as number, limit)
    const fv = calculateFutureValue({
      presentValue: values.currentBalance as number,
      annualRate: values.annualReturn as number,
      years,
      periodicContribution: cappedContribution,
    })
    const afterTaxValue = fv * (1 - (values.expectedRetirementTaxRate as number) / 100)
    const totalContributions = (values.currentBalance as number) + cappedContribution * years
    const earnings = fv - totalContributions
    return {
      balanceAtRetirement: formatCurrency(fv),
      afterTaxValue: formatCurrency(afterTaxValue),
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset}>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Balance at Retirement" value={result.balanceAtRetirement} />
            <ResultsDisplay label="After-Tax Withdrawal Value" value={result.afterTaxValue} highlight />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Total Earnings" value={result.totalEarnings} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}