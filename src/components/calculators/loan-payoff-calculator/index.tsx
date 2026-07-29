import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, percentToDecimal, formatCurrency, formatNumber } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'loanBalance', label: 'Loan Balance', type: 'currency', defaultValue: '', min: 100, max: 10000000 },
  { key: 'interestRate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 36, step: 0.125 },
  { key: 'remainingTermYears', label: 'Remaining Term', type: 'number', defaultValue: '', min: 1, max: 40, suffix: 'years' },
  { key: 'extraMonthlyPayment', label: 'Extra Monthly Payment', type: 'currency', defaultValue: '', min: 0, max: 100000 },
]

function simulateExtraPayment(principal: number, annualRate: number, years: number, extraPayment: number) {
  const amort = solveAmortization({ principal, annualRate, years })
  const payment = amort.payment
  const origMonths = years * 12
  const origInterest = amort.totalInterest

  const i = percentToDecimal(annualRate) / 12
  let balance = principal
  let months = 0
  let totalInterest = 0
  const totalPerPeriod = payment + extraPayment

  while (balance > 0 && months < 1200) {
    const interest = balance * i
    let principalPaid = totalPerPeriod - interest
    if (principalPaid <= 0) break
    if (principalPaid > balance) principalPaid = balance
    balance -= principalPaid
    totalInterest += interest
    months++
  }

  const interestSaved = origInterest - totalInterest

  return {
    origMonths,
    origInterest,
    newMonths: months,
    newTotalInterest: totalInterest,
    interestSaved,
    payment,
  }
}

export function LoanPayoffCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const balance = values.loanBalance as number
    const interestRate = values.interestRate as number
    const remainingTermYears = values.remainingTermYears as number
    const extraPayment = values.extraMonthlyPayment as number

    const sim = simulateExtraPayment(balance, interestRate, remainingTermYears, extraPayment)
    const monthsSaved = sim.origMonths - sim.newMonths

    return {
      originalMonths: formatNumber(sim.origMonths),
      originalInterest: formatCurrency(sim.origInterest),
      newMonths: formatNumber(sim.newMonths),
      newTotalInterest: formatCurrency(sim.newTotalInterest),
      interestSaved: formatCurrency(sim.interestSaved),
      monthsSaved: formatNumber(monthsSaved),
      standardPayment: formatCurrency(sim.payment),
      hasExtra: extraPayment > 0,
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Calculate Payoff">
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Original Schedule</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Payoff Time" value={`${result.originalMonths} months`} />
            <ResultsDisplay label="Total Interest" value={result.originalInterest} />
          </div>
          {result.hasExtra && (
            <>
              <h3 class="text-base sm:text-lg font-semibold text-foreground pt-3">With Extra Payments</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ResultsDisplay label="New Payoff Time" value={`${result.newMonths} months`} />
                <ResultsDisplay label="New Total Interest" value={result.newTotalInterest} />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ResultsDisplay label="Interest Saved" value={result.interestSaved} highlight />
                <ResultsDisplay label="Paid Off Sooner By" value={`${result.monthsSaved} months`} highlight />
              </div>
            </>
          )}
          {!result.hasExtra && (
            <p class="text-sm text-muted-foreground mt-2">Add an extra monthly payment to see how much sooner you can pay off this loan.</p>
          )}
        </div>
      )}
    </CalculatorForm>
  )
}
