import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, formatCurrency } from '@/lib/CalculatorEngine'
import { AmortizationTable } from '@/components/calculators/AmortizationTable'

const fields: FieldDefinition[] = [
  { key: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: '', min: 1000, max: 10000000 },
  { key: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '', min: 1, max: 40, suffix: 'years' },
]

export function AmortizationCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const amort = solveAmortization({ principal: values.loanAmount as number, annualRate: values.rate as number, years: values.loanTerm as number })
    return {
      monthlyPayment: formatCurrency(amort.payment),
      totalInterest: formatCurrency(amort.totalInterest),
      totalPayment: formatCurrency(amort.totalPayment),
      loanAmount: formatCurrency(values.loanAmount as number),
      schedule: amort.schedule,
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
          <h3 class="text-lg font-semibold text-foreground pt-3">Loan Summary</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Loan Amount" value={result.loanAmount} />
            <ResultsDisplay label="Total Interest Paid" value={result.totalInterest} />
            <ResultsDisplay label="Total of All Payments" value={result.totalPayment} />
          </div>
          <h3 class="text-lg font-semibold text-foreground pt-3">Amortization Schedule</h3>
          <AmortizationTable schedule={result.schedule} maxRows={10} />
        </div>
      )}
    </CalculatorForm>
  )
}