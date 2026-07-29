import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFutureValue, calculateRetirementWithdrawal, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: '', min: 18, max: 80, suffix: 'years' },
  { key: 'currentSavings', label: 'Current Retirement Savings', type: 'currency', defaultValue: '', min: 0, max: 100000000 },
  { key: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: '', min: 0, max: 100000 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: '', min: 30, max: 100, suffix: 'years' },
  { key: 'annualSpending', label: 'Annual Spending in Retirement', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'safeWithdrawalRate', label: 'Safe Withdrawal Rate', type: 'percent', defaultValue: '', min: 0, max: 20, step: 0.1 },
]

export function RetirementCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{
    savingsAtRetirement: string
    sustainableIncome: string
    yearsLasts: string
    totalContributions: string
  } | null>(null)
  const { values } = form

  function computeResult() {
    const yearsToRetirement = (values.retirementAge as number) - (values.currentAge as number)
    const fv = calculateFutureValue({
      presentValue: values.currentSavings as number,
      annualRate: values.annualReturn as number,
      years: yearsToRetirement,
      periodicContribution: (values.monthlyContribution as number) * 12,
    })
    const withdrawal = calculateRetirementWithdrawal(
      fv,
      values.safeWithdrawalRate as number,
      values.annualReturn as number,
      values.annualSpending as number,
    )
    const totalContributions = (values.currentSavings as number) + (values.monthlyContribution as number) * 12 * yearsToRetirement
    return {
      savingsAtRetirement: formatCurrency(fv),
      sustainableIncome: formatCurrency(withdrawal.sustainableIncome),
      yearsLasts: withdrawal.yearsLasts === 'indefinite' ? 'Indefinite' : `${withdrawal.yearsLasts} years`,
      totalContributions: formatCurrency(totalContributions),
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Project Retirement">
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Savings at Retirement" value={result.savingsAtRetirement} highlight />
            <ResultsDisplay label="Sustainable Annual Income" value={result.sustainableIncome} highlight />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="How Long Savings Will Last" value={result.yearsLasts} />
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
