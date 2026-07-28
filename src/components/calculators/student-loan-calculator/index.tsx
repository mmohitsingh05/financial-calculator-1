import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, formatCurrency } from '@/lib/CalculatorEngine'

function computePayoffMonths(principal: number, annualRate: number, monthlyPayment: number): number {
  const i = annualRate / 100 / 12
  let balance = principal
  let months = 0
  while (balance > 0 && months < 1200) {
    const interest = balance * i
    let principalPaid = monthlyPayment - interest
    if (principalPaid <= 0) break
    if (principalPaid > balance) principalPaid = balance
    balance -= principalPaid
    months++
  }
  return months
}

const fields: FieldDefinition[] = [
  { key: 'loanBalance', label: 'Total Loan Balance', type: 'currency', defaultValue: 35000, min: 1000, max: 500000 },
  { key: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 5.5, min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: 10, min: 1, max: 30, suffix: 'years' },
  { key: 'monthlyPayment', label: 'Fixed Monthly Payment', type: 'currency', defaultValue: 380, min: 50, max: 10000 },
]

export function StudentLoanCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const p = values.loanBalance as number
    const amort = solveAmortization({ principal: p, annualRate: values.rate as number, years: values.loanTerm as number })
    const userPayment = values.monthlyPayment as number
    const payoffMonths = computePayoffMonths(p, values.rate as number, userPayment)
    const payoffYears = Math.floor(payoffMonths / 12)
    const remainingMonths = payoffMonths % 12
    let payoffText = `${payoffMonths} months`
    if (payoffYears > 0) {
      payoffText = `${payoffYears} year${payoffYears > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }

    const totalPaid = userPayment * payoffMonths
    const totalInterest = totalPaid - p

    return {
      monthlyPayment: formatCurrency(userPayment),
      standardPayment: formatCurrency(amort.payment),
      totalInterest: formatCurrency(totalInterest),
      totalPayment: formatCurrency(totalPaid),
      payoffTime: payoffText,
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
    <CalculatorForm fields={fields} values={values} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Calculate Payment">
      <p class="text-xs text-muted-foreground -mt-2 mb-2">The default monthly payment is the standard 10-year repayment amount.</p>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Monthly Payment</h3>
          <ResultsDisplay label="Your Fixed Monthly Payment" value={result.monthlyPayment} highlight />
          <ResultsDisplay label="Standard 10-Year Payment" value={result.standardPayment} />
          <h3 class="text-lg font-semibold text-foreground pt-3">Loan Summary</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Total Interest Paid" value={result.totalInterest} />
            <ResultsDisplay label="Total of All Payments" value={result.totalPayment} />
            <ResultsDisplay label="Payoff Timeline" value={result.payoffTime} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}