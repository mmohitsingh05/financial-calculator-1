import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'monthlyInvestment', label: 'Monthly Investment', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'years', label: 'Time Horizon', type: 'number', defaultValue: '', min: 1, max: 60, suffix: 'years' },
  { key: 'lumpSum', label: 'Lump Sum to Compare (optional)', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
]

export function DollarCostAveragingCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ dcaFV: string; totalContributions: string; dcaEarnings: string; lumpSumFV: string | null } | null>(null)
  const { values } = form

  function computeResult() {
    const monthly = values.monthlyInvestment as number
    const annualRate = values.annualReturn as number
    const years = values.years as number
    const lumpSum = values.lumpSum as number

    const dcaFV = calculateFutureValue({
      presentValue: 0,
      annualRate,
      years,
      periodicContribution: monthly * 12,
    })
    const totalContributions = monthly * 12 * years
    const dcaEarnings = dcaFV - totalContributions

    let lumpSumFV: string | null = null
    if (lumpSum > 0) {
      const lFV = calculateFutureValue({
        presentValue: lumpSum,
        annualRate,
        years,
        periodicContribution: 0,
      })
      lumpSumFV = formatCurrency(lFV)
    }

    return {
      dcaFV: formatCurrency(dcaFV),
      totalContributions: formatCurrency(totalContributions),
      dcaEarnings: formatCurrency(dcaEarnings),
      lumpSumFV,
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
            <ResultsDisplay label="DCA Future Value" value={result.dcaFV} highlight />
            <ResultsDisplay label="Total DCA Contributions" value={result.totalContributions} />
            <ResultsDisplay label="DCA Earnings" value={result.dcaEarnings} />
          </div>
          {result.lumpSumFV && (
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-3">
              <ResultsDisplay label="Lump Sum Future Value" value={result.lumpSumFV} />
            </div>
          )}
          {result.lumpSumFV && (
            <p class="text-sm text-muted-foreground mt-2">
              {parseFloat(result.dcaFV.replace(/[^0-9.-]/g, '')) > parseFloat(result.lumpSumFV.replace(/[^0-9.-]/g, ''))
                ? 'DCA strategy outperforms lump sum investing with these parameters.'
                : 'Lump sum investing outperforms DCA with these parameters.'}
            </p>
          )}
        </div>
      )}
    </CalculatorForm>
  )
}