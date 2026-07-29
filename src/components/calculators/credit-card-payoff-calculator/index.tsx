import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { simulateCreditCardPayoff, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'balance', label: 'Current Balance', type: 'currency', defaultValue: '', min: 0, max: 1000000 },
  { key: 'apr', label: 'APR', type: 'percent', defaultValue: '', min: 0, max: 100 },
  { key: 'monthlyPayment', label: 'Your Monthly Payment', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'minPaymentPercent', label: 'Minimum Payment % of Balance', type: 'percent', defaultValue: '', min: 0, max: 100 },
]

interface PayoffResult {
  minMonths: string
  minInterest: string
  minTotal: string
  yourMonths: string
  yourInterest: string
  yourTotal: string
}

export function CreditCardPayoffCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<PayoffResult | null>(null)
  const { values } = form

  function computeResult(): PayoffResult {
    const balance = values.balance as number
    const apr = values.apr as number
    const monthlyPayment = values.monthlyPayment as number
    const minPaymentPercent = values.minPaymentPercent as number

    const minScenario = simulateCreditCardPayoff({
      balance,
      apr,
      useMinimumPayment: true,
      minPaymentPercent: minPaymentPercent / 100,
      minPaymentFlat: 25,
    })

    const yourScenario = simulateCreditCardPayoff({
      balance,
      apr,
      monthlyPayment,
      useMinimumPayment: false,
    })

    return {
      minMonths: `${minScenario.months} months`,
      minInterest: formatCurrency(minScenario.totalInterest),
      minTotal: formatCurrency(minScenario.totalPaid),
      yourMonths: `${yourScenario.months} months`,
      yourInterest: formatCurrency(yourScenario.totalInterest),
      yourTotal: formatCurrency(yourScenario.totalPaid),
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Payoff Comparison</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-3">
              <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Paying Minimum</h4>
              <ResultsDisplay label="Time to Pay Off" value={result.minMonths} />
              <ResultsDisplay label="Total Interest Paid" value={result.minInterest} />
              <ResultsDisplay label="Total Amount Paid" value={result.minTotal} />
            </div>
            <div class="space-y-3">
              <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Payment</h4>
              <ResultsDisplay label="Time to Pay Off" value={result.yourMonths} highlight />
              <ResultsDisplay label="Total Interest Paid" value={result.yourInterest} />
              <ResultsDisplay label="Total Amount Paid" value={result.yourTotal} />
            </div>
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
