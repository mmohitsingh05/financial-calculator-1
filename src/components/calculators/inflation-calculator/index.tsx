import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateInflation, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'amount', label: 'Amount', type: 'currency', defaultValue: '', min: 1, max: 100000000 },
  { key: 'inflationRate', label: 'Inflation Rate', type: 'percent', defaultValue: '', min: 0, max: 50, step: 0.1 },
  { key: 'years', label: 'Years', type: 'number', defaultValue: '', min: 1, max: 100 },
]

export function InflationCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const { futureValue, pastValue } = calculateInflation(values.amount as number, values.inflationRate as number, values.years as number)
    const purchasingPowerLost = (values.amount as number) - pastValue
    return {
      futureValue: formatCurrency(futureValue),
      pastValue: formatCurrency(pastValue),
      purchasingPowerLost: formatCurrency(purchasingPowerLost),
      isPositive: purchasingPowerLost >= 0,
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Inflation Impact</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Future Value (what it will be worth)" value={result.futureValue} highlight />
            <ResultsDisplay label="Past Value (what it was worth)" value={result.pastValue} highlight />
          </div>
          <div class={`p-3 rounded-lg border ${result.isPositive ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'}`}>
            <p class="text-xs text-muted-foreground">Purchasing Power Lost</p>
            <p class="text-lg font-bold text-foreground">{result.purchasingPowerLost}</p>
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}