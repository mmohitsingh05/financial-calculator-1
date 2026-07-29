import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateSimpleInterest, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'principal', label: 'Principal', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'interestRate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'years', label: 'Time Period', type: 'number', defaultValue: '', min: 1, max: 60, suffix: 'years' },
]

export function SimpleInterestCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ interest: string; total: string } | null>(null)
  const { values } = form

  function computeResult() {
    const { interest, total } = calculateSimpleInterest({
      principal: values.principal as number,
      annualRate: values.interestRate as number,
      years: values.years as number,
    })
    return {
      interest: formatCurrency(interest),
      total: formatCurrency(total),
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Total Interest" value={result.interest} />
            <ResultsDisplay label="Total Amount" value={result.total} highlight />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}