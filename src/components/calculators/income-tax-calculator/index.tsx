import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFederalTax, formatCurrency, formatPercent } from '@/lib/CalculatorEngine'
import { taxYear2026 } from '@/data/taxBrackets2026'

const fields: FieldDefinition[] = [
  { key: 'grossIncome', label: 'Annual Gross Income', type: 'currency', defaultValue: '', min: 0, max: 100000000 },
  {
    key: 'filingStatus', label: 'Filing Status', type: 'select', defaultValue: 'single',
    options: [
      { label: 'Single', value: 'single' },
      { label: 'Married Filing Jointly', value: 'married-filing-jointly' },
      { label: 'Head of Household', value: 'head-of-household' },
    ],
  },
]

interface TaxResult {
  taxableIncome: string
  totalTax: string
  effectiveRate: string
  marginalRate: string
}

export function IncomeTaxCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<TaxResult | null>(null)
  const { values } = form

  function computeResult(): TaxResult {
    const grossIncome = values.grossIncome as number
    const filingStatus = values.filingStatus as 'single' | 'married-filing-jointly' | 'head-of-household'
    const tax = calculateFederalTax(grossIncome, taxYear2026, filingStatus)
    return {
      taxableIncome: formatCurrency(tax.taxableIncome),
      totalTax: formatCurrency(tax.totalTax),
      effectiveRate: formatPercent(tax.effectiveRate),
      marginalRate: formatPercent(tax.marginalRate * 100),
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Tax Estimate (2026)</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Taxable Income" value={result.taxableIncome} />
            <ResultsDisplay label="Total Federal Tax" value={result.totalTax} highlight />
            <ResultsDisplay label="Effective Tax Rate" value={result.effectiveRate} />
            <ResultsDisplay label="Marginal Tax Rate" value={result.marginalRate} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
