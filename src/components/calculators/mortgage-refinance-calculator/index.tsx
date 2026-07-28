import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, formatCurrency, formatNumber } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'currentBalance', label: 'Current Balance', type: 'currency', defaultValue: 300000, min: 1000, max: 10000000 },
  { key: 'currentRate', label: 'Current Interest Rate', type: 'percent', defaultValue: 6.5, min: 0, max: 20, step: 0.125 },
  { key: 'remainingYears', label: 'Remaining Years', type: 'number', defaultValue: 25, min: 1, max: 40, suffix: 'years' },
  { key: 'newRate', label: 'New Interest Rate', type: 'percent', defaultValue: 5.5, min: 0, max: 20, step: 0.125 },
  { key: 'newTermYears', label: 'New Loan Term', type: 'number', defaultValue: 30, min: 1, max: 40, suffix: 'years' },
  { key: 'closingCosts', label: 'Closing Costs', type: 'currency', defaultValue: 5000, min: 0, max: 100000 },
]

export function MortgageRefinanceCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const balance = values.currentBalance as number
    const currentRate = values.currentRate as number
    const remainingYears = values.remainingYears as number
    const newRate = values.newRate as number
    const newTermYears = values.newTermYears as number
    const closingCosts = values.closingCosts as number

    const current = solveAmortization({ principal: balance, annualRate: currentRate, years: remainingYears })
    const newLoan = solveAmortization({ principal: balance, annualRate: newRate, years: newTermYears })

    const monthlySavings = current.payment - newLoan.payment
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity

    return {
      currentPayment: formatCurrency(current.payment),
      newPayment: formatCurrency(newLoan.payment),
      monthlySavings: formatCurrency(monthlySavings),
      breakEvenMonths: monthlySavings > 0 ? formatNumber(breakEvenMonths) : 'N/A',
      currentTotalInterest: formatCurrency(current.totalInterest),
      newTotalInterest: formatCurrency(newLoan.totalInterest),
      totalInterestSavings: formatCurrency(current.totalInterest - newLoan.totalInterest),
      isBeneficial: monthlySavings > 0,
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
          <h3 class="text-lg font-semibold text-foreground">Payment Comparison</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Current Monthly Payment" value={result.currentPayment} />
            <ResultsDisplay label="New Monthly Payment" value={result.newPayment} />
          </div>
          <ResultsDisplay label="Monthly Savings" value={result.monthlySavings} highlight={result.isBeneficial} />
          <ResultsDisplay label="Break-Even Point" value={`${result.breakEvenMonths} months`} highlight={result.isBeneficial} />
          <h3 class="text-lg font-semibold text-foreground pt-3">Total Interest Over Loan Life</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Current Loan Interest" value={result.currentTotalInterest} />
            <ResultsDisplay label="New Loan Interest" value={result.newTotalInterest} />
            <ResultsDisplay label="Interest Savings" value={result.totalInterestSavings} highlight={result.isBeneficial} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
