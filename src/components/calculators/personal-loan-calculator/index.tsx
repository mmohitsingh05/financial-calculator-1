import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, percentToDecimal, formatCurrency, formatPercent } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: '', min: 100, max: 1000000 },
  { key: 'interestRate', label: 'Interest Rate (APR)', type: 'percent', defaultValue: '', min: 0, max: 36, step: 0.125 },
  { key: 'termYears', label: 'Loan Term', type: 'number', defaultValue: '', min: 1, max: 30, suffix: 'years' },
  { key: 'originationFee', label: 'Origination Fee', type: 'currency', defaultValue: '', min: 0, max: 100000 },
]

function estimateEffectiveAPR(loanAmount: number, monthlyPayment: number, N: number, amountFinanced: number): number {
  if (amountFinanced >= loanAmount) return percentToDecimal(0)
  let low = 0
  let high = 1
  for (let iter = 0; iter < 100; iter++) {
    const mid = (low + high) / 2
    const i = mid / 12
    let pv = 0
    for (let k = 1; k <= N; k++) {
      pv += monthlyPayment / Math.pow(1 + i, k)
    }
    if (pv > amountFinanced) low = mid
    else high = mid
  }
  return (low + high) / 2
}

export function PersonalLoanCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const loanAmount = values.loanAmount as number
    const interestRate = values.interestRate as number
    const termYears = values.termYears as number
    const originationFee = values.originationFee as number
    const amountFinanced = loanAmount - originationFee

    const amort = solveAmortization({ principal: loanAmount, annualRate: interestRate, years: termYears })

    let effectiveAPR: number | null = null
    let aprLabel = formatPercent(interestRate)
    if (originationFee > 0) {
      effectiveAPR = estimateEffectiveAPR(loanAmount, amort.payment, amort.schedule.length, amountFinanced)
      aprLabel = formatPercent(effectiveAPR * 100) + ' (with origination fee)'
    }

    return {
      monthlyPayment: formatCurrency(amort.payment),
      totalInterest: formatCurrency(amort.totalInterest),
      totalPayment: formatCurrency(amort.totalPayment),
      apr: aprLabel,
      amountFinanced: formatCurrency(amountFinanced),
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
          <h3 class="text-lg font-semibold text-foreground">Monthly Payment</h3>
          <ResultsDisplay label="Monthly Payment" value={result.monthlyPayment} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Total Interest Paid" value={result.totalInterest} />
            <ResultsDisplay label="Total of All Payments" value={result.totalPayment} />
            <ResultsDisplay label="Amount Financed" value={result.amountFinanced} />
          </div>
          <div class="pt-3">
            <ResultsDisplay label="APR" value={result.apr} highlight />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
