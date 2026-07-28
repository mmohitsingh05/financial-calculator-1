import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'vehiclePrice', label: 'Vehicle Price', type: 'currency', defaultValue: 35000, min: 1000, max: 1000000 },
  { key: 'downPayment', label: 'Down Payment', type: 'currency', defaultValue: 5000, min: 0, max: 500000 },
  { key: 'tradeInValue', label: 'Trade-In Value', type: 'currency', defaultValue: 0, min: 0, max: 500000 },
  { key: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 6.5, min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: 60, min: 12, max: 84, suffix: 'months' },
]

export function AutoLoanCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const p = (values.vehiclePrice as number) - (values.downPayment as number) - (values.tradeInValue as number)
    const amort = solveAmortization({ principal: p, annualRate: values.rate as number, years: (values.loanTerm as number) / 12 })
    return {
      monthlyPayment: formatCurrency(amort.payment),
      totalInterest: formatCurrency(amort.totalInterest),
      totalPayment: formatCurrency(amort.totalPayment),
      loanAmount: formatCurrency(p),
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
          <h3 class="text-lg font-semibold text-foreground">Monthly Payment</h3>
          <ResultsDisplay label="Monthly Car Payment" value={result.monthlyPayment} highlight />
          <h3 class="text-lg font-semibold text-foreground pt-3">Loan Summary</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Loan Amount" value={result.loanAmount} />
            <ResultsDisplay label="Total Interest Paid" value={result.totalInterest} />
            <ResultsDisplay label="Total of All Payments" value={result.totalPayment} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}