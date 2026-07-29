import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'deposit', label: 'Deposit Amount', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'interestRate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'termMonths', label: 'Term', type: 'number', defaultValue: '', min: 1, max: 120, suffix: 'months' },
  { key: 'compoundFrequency', label: 'Compound Frequency', type: 'select', defaultValue: 12, options: [
    { label: 'Monthly (12)', value: 12 },
    { label: 'Daily (365)', value: 365 },
    { label: 'Quarterly (4)', value: 4 },
    { label: 'Annually (1)', value: 1 },
  ]},
]

export function CDCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ maturityValue: string; totalInterest: string; effectiveAPY: string } | null>(null)
  const { values } = form

  function computeResult() {
    const years = (values.termMonths as number) / 12
    const fv = calculateFutureValue({
      presentValue: values.deposit as number,
      annualRate: values.interestRate as number,
      years,
      compoundingFrequency: values.compoundFrequency as any,
      periodicContribution: 0,
    })
    const interest = fv - (values.deposit as number)
    const n = values.compoundFrequency as number
    const r = (values.interestRate as number) / 100
    const apy = (Math.pow(1 + r / n, n) - 1) * 100
    return {
      maturityValue: formatCurrency(fv),
      totalInterest: formatCurrency(interest),
      effectiveAPY: `${apy.toFixed(2)}%`,
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Maturity Value" value={result.maturityValue} />
            <ResultsDisplay label="Total Interest" value={result.totalInterest} highlight />
            <ResultsDisplay label="Effective APY" value={result.effectiveAPY} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}