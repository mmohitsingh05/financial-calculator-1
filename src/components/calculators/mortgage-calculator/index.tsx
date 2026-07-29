import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { solveAmortization, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'homePrice', label: 'Home Price', type: 'currency', defaultValue: '', min: 10000, max: 10000000 },
  { key: 'downPayment', label: 'Down Payment', type: 'currency', defaultValue: '', min: 0, max: 5000000 },
  { key: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '', min: 1, max: 40, suffix: 'years' },
  { key: 'propertyTax', label: 'Annual Property Tax', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'insurance', label: 'Annual Home Insurance', type: 'currency', defaultValue: '', min: 0, max: 50000 },
]

export function MortgageCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const p = (values.homePrice as number) - (values.downPayment as number)
    const amort = solveAmortization({ principal: p, annualRate: values.rate as number, years: values.loanTerm as number })
    const monthlyTax = (values.propertyTax as number) / 12
    const monthlyInsurance = (values.insurance as number) / 12
    const totalMonthly = amort.payment + monthlyTax + monthlyInsurance
    return {
      monthlyPayment: formatCurrency(totalMonthly),
      principalInterest: formatCurrency(amort.payment),
      propertyTax: formatCurrency(monthlyTax),
      insurance: formatCurrency(monthlyInsurance),
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset}>
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Monthly Payment</h3>
          <ResultsDisplay label="Total Monthly Payment (PITI)" value={result.monthlyPayment} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Principal & Interest" value={result.principalInterest} />
            <ResultsDisplay label="Property Tax" value={result.propertyTax} />
            <ResultsDisplay label="Home Insurance" value={result.insurance} />
          </div>
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