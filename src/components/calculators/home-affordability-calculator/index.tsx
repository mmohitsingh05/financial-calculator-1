import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'annualIncome', label: 'Annual Household Income', type: 'currency', defaultValue: '', min: 0, max: 100000000 },
  { key: 'monthlyDebts', label: 'Monthly Debt Payments', type: 'currency', defaultValue: '', min: 0, max: 1000000 },
  { key: 'downPayment', label: 'Down Payment', type: 'currency', defaultValue: '', min: 0, max: 100000000 },
  { key: 'interestRate', label: 'Interest Rate', type: 'percent', defaultValue: '', min: 0, max: 20, step: 0.125 },
  { key: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '', min: 1, max: 40, suffix: 'years' },
  { key: 'propertyTaxRate', label: 'Annual Property Tax Rate', type: 'percent', defaultValue: '', min: 0, max: 5, step: 0.1 },
  { key: 'annualInsurance', label: 'Annual Insurance', type: 'currency', defaultValue: '', min: 0, max: 50000 },
]

interface AffordResult {
  maxHomePrice: string
  maxLoanAmount: string
  monthlyPayment: string
  frontEndLimit: string
  backEndLimit: string
}

export function HomeAffordabilityCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<AffordResult | null>(null)
  const { values } = form

  function computeResult(): AffordResult {
    const annualIncome = values.annualIncome as number
    const monthlyDebts = values.monthlyDebts as number
    const downPayment = values.downPayment as number
    const annualRate = values.interestRate as number
    const loanYears = values.loanTerm as number
    const annualTaxRate = values.propertyTaxRate as number
    const annualInsurance = values.annualInsurance as number

    const monthlyIncome = annualIncome / 12
    const frontEndLimit = monthlyIncome * 0.28
    const backEndLimit = monthlyIncome * 0.36
    const maxHousing = Math.min(frontEndLimit, backEndLimit - monthlyDebts)
    const monthlyInsurance = annualInsurance / 12

    const i = (annualRate / 100) / 12
    const N = loanYears * 12

    const availableNoTax = maxHousing - monthlyInsurance
    let maxLoan: number
    if (i === 0) {
      maxLoan = availableNoTax * N
    } else {
      maxLoan = availableNoTax * (Math.pow(1 + i, N) - 1) / (i * Math.pow(1 + i, N))
    }

    const estimatedPrice = maxLoan + downPayment
    const monthlyTax = (estimatedPrice * (annualTaxRate / 100)) / 12
    const available = maxHousing - monthlyTax - monthlyInsurance

    if (i === 0) {
      maxLoan = available * N
    } else {
      maxLoan = available * (Math.pow(1 + i, N) - 1) / (i * Math.pow(1 + i, N))
    }

    const maxPrice = maxLoan + downPayment

    let monthlyPayment: number
    if (i === 0) {
      monthlyPayment = maxLoan / N + monthlyTax + monthlyInsurance
    } else {
      const mp = maxLoan * (i * Math.pow(1 + i, N)) / (Math.pow(1 + i, N) - 1)
      monthlyPayment = mp + monthlyTax + monthlyInsurance
    }

    return {
      maxHomePrice: formatCurrency(maxPrice),
      maxLoanAmount: formatCurrency(maxLoan),
      monthlyPayment: formatCurrency(monthlyPayment),
      frontEndLimit: formatCurrency(frontEndLimit),
      backEndLimit: formatCurrency(backEndLimit),
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
          <h3 class="text-lg font-semibold text-foreground">Affordability Estimate</h3>
          <ResultsDisplay label="Maximum Home Price" value={result.maxHomePrice} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Max Loan Amount" value={result.maxLoanAmount} />
            <ResultsDisplay label="Estimated Monthly Payment" value={result.monthlyPayment} />
            <ResultsDisplay label="Front-End Limit (28%)" value={result.frontEndLimit} />
            <ResultsDisplay label="Back-End Limit (36%)" value={result.backEndLimit} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
