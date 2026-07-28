import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateDTI, formatPercent } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'grossMonthlyIncome', label: 'Gross Monthly Income', type: 'currency', defaultValue: 6000, min: 100, max: 1000000 },
  { key: 'monthlyHousing', label: 'Monthly Housing Payment', type: 'currency', defaultValue: 1500, min: 0, max: 500000 },
  { key: 'otherMonthlyDebts', label: 'Other Monthly Debts', type: 'currency', defaultValue: 500, min: 0, max: 500000 },
]

function frontEndStatus(ratio: number): { label: string; color: string } {
  if (ratio <= 28) return { label: 'Good', color: 'text-green-600' }
  if (ratio <= 36) return { label: 'Borderline', color: 'text-amber-600' }
  return { label: 'Too High', color: 'text-red-600' }
}

function backEndStatus(ratio: number): { label: string; color: string } {
  if (ratio <= 36) return { label: 'Good', color: 'text-green-600' }
  if (ratio <= 43) return { label: 'Borderline', color: 'text-amber-600' }
  return { label: 'Too High', color: 'text-red-600' }
}

export function DebtToIncomeCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null)
  const { values } = form

  function computeResult() {
    const income = values.grossMonthlyIncome as number
    const housing = values.monthlyHousing as number
    const debts = values.otherMonthlyDebts as number

    const dti = calculateDTI({ monthlyHousing: housing, monthlyDebts: debts, grossMonthlyIncome: income })
    const front = frontEndStatus(dti.frontEnd)
    const back = backEndStatus(dti.backEnd)

    return {
      frontEnd: formatPercent(dti.frontEnd),
      backEnd: formatPercent(dti.backEnd),
      frontLabel: front.label,
      frontColor: front.color,
      backLabel: back.label,
      backColor: back.color,
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
          <h3 class="text-lg font-semibold text-foreground">Your Debt-to-Income Ratios</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 rounded-lg bg-muted">
              <p class="text-xs text-muted-foreground">Front-End DTI (Housing Only)</p>
              <p class="text-lg font-bold text-foreground">{result.frontEnd}</p>
              <p class={`text-sm font-medium ${result.frontColor}`}>{result.frontLabel}</p>
              <p class="text-xs text-muted-foreground mt-1">Target: ≤ 28%</p>
            </div>
            <div class="p-3 rounded-lg bg-muted">
              <p class="text-xs text-muted-foreground">Back-End DTI (Total Debt)</p>
              <p class="text-lg font-bold text-foreground">{result.backEnd}</p>
              <p class={`text-sm font-medium ${result.backColor}`}>{result.backLabel}</p>
              <p class="text-xs text-muted-foreground mt-1">Target: ≤ 36%</p>
            </div>
          </div>
        </div>
      )}
    </CalculatorForm>
  )
}
