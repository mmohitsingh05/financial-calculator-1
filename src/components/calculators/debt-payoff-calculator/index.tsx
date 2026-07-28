import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { simulateDebtPayoff, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'debt1Balance', label: 'Debt 1 Balance', type: 'currency', defaultValue: 5000, min: 0, max: 10000000 },
  { key: 'debt1Apr', label: 'Debt 1 APR', type: 'percent', defaultValue: 22, min: 0, max: 40, step: 0.1 },
  { key: 'debt1MinPayment', label: 'Debt 1 Min Payment', type: 'currency', defaultValue: 100, min: 1, max: 1000000 },
  { key: 'debt2Balance', label: 'Debt 2 Balance', type: 'currency', defaultValue: 10000, min: 0, max: 10000000 },
  { key: 'debt2Apr', label: 'Debt 2 APR', type: 'percent', defaultValue: 9, min: 0, max: 40, step: 0.1 },
  { key: 'debt2MinPayment', label: 'Debt 2 Min Payment', type: 'currency', defaultValue: 200, min: 1, max: 1000000 },
  { key: 'debt3Balance', label: 'Debt 3 Balance', type: 'currency', defaultValue: 15000, min: 0, max: 10000000 },
  { key: 'debt3Apr', label: 'Debt 3 APR', type: 'percent', defaultValue: 6, min: 0, max: 40, step: 0.1 },
  { key: 'debt3MinPayment', label: 'Debt 3 Min Payment', type: 'currency', defaultValue: 300, min: 1, max: 1000000 },
  { key: 'extraMonthly', label: 'Extra Monthly Payment', type: 'currency', defaultValue: 200, min: 0, max: 1000000 },
]

export function DebtPayoffCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const debts = [
      { name: 'Debt 1', balance: values.debt1Balance as number, apr: values.debt1Apr as number, minimumPayment: values.debt1MinPayment as number },
      { name: 'Debt 2', balance: values.debt2Balance as number, apr: values.debt2Apr as number, minimumPayment: values.debt2MinPayment as number },
      { name: 'Debt 3', balance: values.debt3Balance as number, apr: values.debt3Apr as number, minimumPayment: values.debt3MinPayment as number },
    ]
    const extra = values.extraMonthly as number
    const snowballResult = simulateDebtPayoff(debts, extra, 'snowball')
    const avalancheResult = simulateDebtPayoff(debts, extra, 'avalanche')
    return {
      snowballMonths: snowballResult.months,
      snowballInterest: formatCurrency(snowballResult.totalInterest),
      snowballTotalPaid: formatCurrency(snowballResult.totalPaid),
      snowballOrder: snowballResult.payoffOrder.map(d => d.name),
      avalancheMonths: avalancheResult.months,
      avalancheInterest: formatCurrency(avalancheResult.totalInterest),
      avalancheTotalPaid: formatCurrency(avalancheResult.totalPaid),
      avalancheOrder: avalancheResult.payoffOrder.map(d => d.name),
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
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-semibold text-foreground">Payoff Comparison</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg border border-border bg-card">
              <h4 class="text-base font-semibold text-foreground mb-3">❄️ Snowball Method</h4>
              <div class="space-y-2">
                <ResultsDisplay label="Months to Debt-Free" value={`${result.snowballMonths} months`} highlight />
                <ResultsDisplay label="Total Interest Paid" value={result.snowballInterest} />
                <ResultsDisplay label="Total Paid" value={result.snowballTotalPaid} />
                <div class="pt-2">
                  <p class="text-xs text-muted-foreground mb-1">Payoff Order</p>
                  <ol class="list-decimal list-inside text-sm text-foreground space-y-0.5">
                    {result.snowballOrder.map((name, i) => <li key={i}>{name}</li>)}
                  </ol>
                </div>
              </div>
            </div>
            <div class="p-4 rounded-lg border border-border bg-card">
              <h4 class="text-base font-semibold text-foreground mb-3">⚡ Avalanche Method</h4>
              <div class="space-y-2">
                <ResultsDisplay label="Months to Debt-Free" value={`${result.avalancheMonths} months`} highlight />
                <ResultsDisplay label="Total Interest Paid" value={result.avalancheInterest} />
                <ResultsDisplay label="Total Paid" value={result.avalancheTotalPaid} />
                <div class="pt-2">
                  <p class="text-xs text-muted-foreground mb-1">Payoff Order</p>
                  <ol class="list-decimal list-inside text-sm text-foreground space-y-0.5">
                    {result.avalancheOrder.map((name, i) => <li key={i}>{name}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}