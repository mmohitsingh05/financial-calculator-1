import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateROI, formatCurrency, formatPercent } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'initialInvestment', label: 'Initial Investment', type: 'currency', defaultValue: '', min: 1, max: 100000000 },
  { key: 'finalValue', label: 'Final Value', type: 'currency', defaultValue: '', min: 1, max: 100000000 },
  { key: 'years', label: 'Investment Period', type: 'number', defaultValue: '', min: 1, max: 100, suffix: 'years' },
]

export function ROICalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const { roi, annualizedRoi } = calculateROI({
      initialInvestment: values.initialInvestment as number,
      finalValue: values.finalValue as number,
      years: values.years as number,
    })
    const gain = (values.finalValue as number) - (values.initialInvestment as number)
    return {
      roi: formatPercent(roi),
      annualizedRoi: annualizedRoi !== null ? formatPercent(annualizedRoi) : 'N/A',
      totalGain: formatCurrency(gain),
      isPositive: gain >= 0,
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Return on Investment</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Total ROI" value={result.roi} highlight />
            <ResultsDisplay label="Annualized ROI (CAGR)" value={result.annualizedRoi} highlight />
          </div>
          <div class={`p-3 rounded-lg border ${result.isPositive ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'}`}>
            <p class="text-xs text-muted-foreground">Total Gain / Loss</p>
            <p class="text-lg font-bold text-foreground">{result.totalGain}</p>
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}