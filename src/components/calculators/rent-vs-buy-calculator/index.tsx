import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateRentVsBuy, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'monthlyRent', label: 'Monthly Rent', type: 'currency', defaultValue: 1500, min: 100, max: 50000 },
  { key: 'annualRentIncrease', label: 'Annual Rent Increase', type: 'percent', defaultValue: 3, min: 0, max: 20, step: 0.1 },
  { key: 'homePrice', label: 'Home Price', type: 'currency', defaultValue: 350000, min: 10000, max: 10000000 },
  { key: 'downPaymentPercent', label: 'Down Payment', type: 'percent', defaultValue: 20, min: 0, max: 100, step: 1 },
  { key: 'mortgageRate', label: 'Mortgage Rate', type: 'percent', defaultValue: 6.5, min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: 30, min: 1, max: 40, suffix: 'years' },
  { key: 'annualTaxRate', label: 'Annual Property Tax Rate', type: 'percent', defaultValue: 1.2, min: 0, max: 10, step: 0.1 },
  { key: 'annualInsurance', label: 'Annual Home Insurance', type: 'currency', defaultValue: 1200, min: 0, max: 50000 },
  { key: 'annualMaintenancePercent', label: 'Annual Maintenance', type: 'percent', defaultValue: 1, min: 0, max: 10, step: 0.1 },
  { key: 'closingCostsPercent', label: 'Closing Costs', type: 'percent', defaultValue: 3, min: 0, max: 10, step: 0.1 },
  { key: 'annualAppreciation', label: 'Annual Appreciation', type: 'percent', defaultValue: 3, min: 0, max: 20, step: 0.1 },
  { key: 'investmentReturn', label: 'Investment Return Rate', type: 'percent', defaultValue: 7, min: 0, max: 30, step: 0.1 },
  { key: 'holdingYears', label: 'Holding Period', type: 'number', defaultValue: 7, min: 1, max: 50, suffix: 'years' },
  { key: 'sellingCostPercent', label: 'Selling Costs', type: 'percent', defaultValue: 6, min: 0, max: 15, step: 0.1 },
]

export function RentVsBuyCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const rvb = calculateRentVsBuy({
      monthlyRent: values.monthlyRent as number,
      annualRentIncrease: values.annualRentIncrease as number,
      homePrice: values.homePrice as number,
      downPaymentPercent: values.downPaymentPercent as number,
      annualRate: values.mortgageRate as number,
      loanYears: values.loanTerm as number,
      annualTaxRate: values.annualTaxRate as number,
      annualInsurance: values.annualInsurance as number,
      annualMaintenancePercent: values.annualMaintenancePercent as number,
      closingCostsPercent: values.closingCostsPercent as number,
      annualAppreciation: values.annualAppreciation as number,
      investmentReturn: values.investmentReturn as number,
      holdingYears: values.holdingYears as number,
      sellingCostPercent: values.sellingCostPercent as number,
    })
    return {
      totalRentCost: formatCurrency(rvb.totalRentCost),
      totalBuyingCost: formatCurrency(rvb.totalBuyingCost),
      buyBetter: rvb.buyBetter,
      breakEvenYear: rvb.breakEvenYear,
      netEquity: formatCurrency(rvb.netEquity),
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
          <h3 class="text-lg font-semibold text-foreground">Rent vs. Buy Comparison</h3>
          <div class={`p-4 rounded-lg border ${result.buyBetter ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'}`}>
            <p class="text-sm font-medium text-foreground">
              {result.buyBetter ? '✅ Buying is the better financial choice' : '🏠 Renting is the better financial choice'}
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <p class="text-xs text-muted-foreground">Total Cost of Renting</p>
              <p class="text-lg font-bold text-foreground">{result.totalRentCost}</p>
            </div>
            <div class="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <p class="text-xs text-muted-foreground">Total Cost of Buying</p>
              <p class="text-lg font-bold text-foreground">{result.totalBuyingCost}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.breakEvenYear && (
              <ResultsDisplay label="Break-Even Year" value={`Year ${result.breakEvenYear}`} highlight />
            )}
            <ResultsDisplay label="Net Equity Built" value={result.netEquity} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}