import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculate401k, formatCurrency } from '@/lib/CalculatorEngine'
import contributionLimits from '@/data/contributionLimits2026.json'

const fields: FieldDefinition[] = [
  { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: '', min: 18, max: 80, suffix: 'years' },
  { key: 'currentBalance', label: 'Current 401(k) Balance', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'annualSalary', label: 'Annual Salary', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'employeeContribution', label: 'Employee Contribution', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.5 },
  { key: 'employerMatchRate', label: 'Employer Match Rate', type: 'percent', defaultValue: '', min: 0, max: 200, step: 1 },
  { key: 'employerMatchCap', label: 'Employer Match Cap (% of salary)', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.5 },
  { key: 'annualReturn', label: 'Annual Return', type: 'percent', defaultValue: '', min: 0, max: 100, step: 0.1 },
  { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: '', min: 30, max: 100, suffix: 'years' },
]

export function FourOneKCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{futureValue: string; totalContributions: string; employerMatchTotal: string} | null>(null)
  const { values } = form

  function computeResult() {
    const limit = (contributionLimits as any).solo401kLimit || 23500
    const years = (values.retirementAge as number) - (values.currentAge as number)
    const calc = calculate401k(
      values.currentBalance as number,
      values.annualSalary as number,
      values.employeeContribution as number,
      values.employerMatchRate as number,
      values.employerMatchCap as number,
      values.annualReturn as number,
      years,
      limit,
    )
    return {
      futureValue: formatCurrency(calc.futureValue),
      totalContributions: formatCurrency(calc.totalContributions),
      employerMatchTotal: formatCurrency(calc.employerMatchTotal),
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
    <CalculatorForm fields={fields} values={values} displayValues={form.displayValues} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Project Savings">
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Projected Savings at Retirement</h3>
          <ResultsDisplay label="Balance at Retirement" value={result.futureValue} highlight />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Total Contributions" value={result.totalContributions} />
            <ResultsDisplay label="Employer Match Total" value={result.employerMatchTotal} />
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
