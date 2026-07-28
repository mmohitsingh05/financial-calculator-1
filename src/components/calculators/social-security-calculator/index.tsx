import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { estimateSocialSecurity, formatCurrency } from '@/lib/CalculatorEngine'

const fields: FieldDefinition[] = [
  { key: 'estimatedBenefitAtFRA', label: 'Est. Benefit at FRA', type: 'currency', defaultValue: 1800, min: 0, max: 10000 },
  { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 35, min: 18, max: 80, suffix: 'years' },
  { key: 'fullRetirementAge', label: 'Full Retirement Age', type: 'number', defaultValue: 67, min: 62, max: 70, suffix: 'years' },
  { key: 'claimAge', label: 'Claim Age', type: 'range', defaultValue: 67, min: 62, max: 70, step: 1, suffix: 'years' },
]

export function SocialSecurityCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<{ monthlyBenefit: string; annualBenefit: string; percentOfFRA: string; claimingEarly: boolean } | null>(null)
  const { values } = form

  function computeResult() {
    const benefit = estimateSocialSecurity(
      values.estimatedBenefitAtFRA as number,
      values.claimAge as number,
      values.fullRetirementAge as number,
    )
    const percentOfFRA = (benefit / (values.estimatedBenefitAtFRA as number)) * 100
    return {
      monthlyBenefit: formatCurrency(benefit),
      annualBenefit: formatCurrency(benefit * 12),
      percentOfFRA: `${percentOfFRA.toFixed(1)}%`,
      claimingEarly: (values.claimAge as number) < (values.fullRetirementAge as number),
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
    <CalculatorForm fields={fields} values={values} errors={form.errors} touched={form.touched} onChange={form.setValue} onCalculate={handleCalculate} onReset={handleReset} calculateLabel="Estimate Benefit">
      {result && (
        <div class="mt-6 space-y-3">
          <h3 class="text-lg font-semibold text-foreground">Results</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultsDisplay label="Estimated Monthly Benefit" value={result.monthlyBenefit} highlight />
            <ResultsDisplay label="Annual Benefit" value={result.annualBenefit} />
            <ResultsDisplay label="Percentage of FRA" value={result.percentOfFRA} />
          </div>
          {result.claimingEarly && (
            <p class="text-sm text-amber-600 dark:text-amber-400 mt-2">
              You are claiming before Full Retirement Age. Your benefit is permanently reduced.
            </p>
          )}
          <p class="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
            This is a simplified estimate. Visit ssa.gov for your exact benefit calculation based on your full earnings history.
          </p>
        </div>
      )}
    </CalculatorForm>
  )
}