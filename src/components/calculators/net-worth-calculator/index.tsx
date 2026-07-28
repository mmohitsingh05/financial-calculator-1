import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateNetWorth, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'cashSavings', label: 'Cash & Savings', type: 'currency', defaultValue: 10000, min: 0, max: 10000000 },
  { key: 'investments', label: 'Investments', type: 'currency', defaultValue: 50000, min: 0, max: 10000000 },
  { key: 'retirementAccounts', label: 'Retirement Accounts', type: 'currency', defaultValue: 75000, min: 0, max: 10000000 },
  { key: 'homeValue', label: 'Home Value', type: 'currency', defaultValue: 300000, min: 0, max: 10000000 },
  { key: 'vehicleValue', label: 'Vehicle Value', type: 'currency', defaultValue: 25000, min: 0, max: 1000000 },
  { key: 'otherAssets', label: 'Other Assets', type: 'currency', defaultValue: 5000, min: 0, max: 10000000 },
  { key: 'mortgageBalance', label: 'Mortgage Balance', type: 'currency', defaultValue: 200000, min: 0, max: 10000000 },
  { key: 'autoLoans', label: 'Auto Loans', type: 'currency', defaultValue: 15000, min: 0, max: 1000000 },
  { key: 'studentLoans', label: 'Student Loans', type: 'currency', defaultValue: 20000, min: 0, max: 1000000 },
  { key: 'creditCardDebt', label: 'Credit Card Debt', type: 'currency', defaultValue: 5000, min: 0, max: 1000000 },
  { key: 'personalLoans', label: 'Personal Loans', type: 'currency', defaultValue: 0, min: 0, max: 1000000 },
  { key: 'otherDebt', label: 'Other Debt', type: 'currency', defaultValue: 0, min: 0, max: 1000000 },
]

export function NetWorthCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const assets = [
      values.cashSavings as number,
      values.investments as number,
      values.retirementAccounts as number,
      values.homeValue as number,
      values.vehicleValue as number,
      values.otherAssets as number,
    ]
    const liabilities = [
      values.mortgageBalance as number,
      values.autoLoans as number,
      values.studentLoans as number,
      values.creditCardDebt as number,
      values.personalLoans as number,
      values.otherDebt as number,
    ]
    const totalAssets = assets.reduce((s, a) => s + a, 0)
    const totalLiabilities = liabilities.reduce((s, l) => s + l, 0)
    const netWorth = calculateNetWorth(assets, liabilities)
    return {
      totalAssets: formatCurrency(totalAssets),
      totalLiabilities: formatCurrency(totalLiabilities),
      netWorth: formatCurrency(netWorth),
      isPositive: netWorth >= 0,
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
          <h3 class="text-lg font-semibold text-foreground">Net Worth Summary</h3>
          <div class={`p-4 rounded-lg border ${result.isPositive ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'}`}>
            <ResultsDisplay label="Net Worth" value={result.netWorth} highlight />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Total Assets" value={result.totalAssets} />
            <ResultsDisplay label="Total Liabilities" value={result.totalLiabilities} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}