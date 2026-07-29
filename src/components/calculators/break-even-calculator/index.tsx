import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateBreakEven, formatCurrency, formatPercent, formatNumber } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'fixedCosts', label: 'Fixed Costs', type: 'currency', defaultValue: '', min: 0, max: 100000000 },
  { key: 'pricePerUnit', label: 'Price per Unit', type: 'currency', defaultValue: '', min: 1, max: 1000000 },
  { key: 'variableCostPerUnit', label: 'Variable Cost per Unit', type: 'currency', defaultValue: '', min: 0, max: 1000000 },
]

export function BreakEvenCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const be = calculateBreakEven({
      fixedCosts: values.fixedCosts as number,
      pricePerUnit: values.pricePerUnit as number,
      variableCostPerUnit: values.variableCostPerUnit as number,
    })
    return {
      units: formatNumber(be.units),
      revenue: formatCurrency(be.revenue),
      contributionMargin: formatCurrency(be.contributionMargin),
      contributionMarginRatio: formatPercent(be.contributionMarginRatio * 100),
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Break-Even Analysis</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Break-Even Units" value={result.units} highlight />
            <ResultsDisplay label="Break-Even Revenue" value={result.revenue} highlight />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Contribution Margin per Unit" value={result.contributionMargin} />
            <ResultsDisplay label="Contribution Margin Ratio" value={result.contributionMarginRatio} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}