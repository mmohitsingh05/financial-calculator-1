import { useState } from 'preact/hooks'
import { useCalculatorForm, type FieldDefinition } from '@/components/calculators/useCalculatorForm'
import { CalculatorForm, ResultsDisplay } from '@/components/calculators/CalculatorForm'
import { calculateFICA, calculateFederalTax, formatCurrency } from '@/lib/CalculatorEngine'
import ficaRates from '@/data/ficaRates2026.json'
import { taxYear2026 } from '@/data/taxBrackets2026'

const fields: FieldDefinition[] = [
  { key: 'annualSalary', label: 'Annual Salary', type: 'currency', defaultValue: '', min: 0, max: 10000000 },
  { key: 'payPeriods', label: 'Pay Periods per Year', type: 'number', defaultValue: '', min: 12, max: 52, suffix: 'periods' },
  { key: 'stateTaxRate', label: 'State Tax Rate', type: 'percent', defaultValue: '', min: 0, max: 15 },
  { key: 'contributionPercent', label: '401(k) Contribution', type: 'percent', defaultValue: '', min: 0, max: 100 },
  { key: 'healthInsurance', label: 'Health Insurance per Period', type: 'currency', defaultValue: '', min: 0, max: 10000 },
  { key: 'otherDeductions', label: 'Other Deductions per Period', type: 'currency', defaultValue: '', min: 0, max: 10000 },
]

interface PaycheckResult {
  grossPay: string
  federalTax: string
  ficaSocialSecurity: string
  ficaMedicare: string
  stateTax: string
  retirementContrib: string
  healthInsurance: string
  otherDeductions: string
  netPay: string
  annualNetPay: string
}

export function PaycheckCalculator() {
  const form = useCalculatorForm(fields)
  const [result, setResult] = useState<PaycheckResult | null>(null)
  const { values } = form

  function computeResult(): PaycheckResult {
    const annualSalary = values.annualSalary as number
    const payPeriods = values.payPeriods as number
    const stateTaxRate = values.stateTaxRate as number
    const contributionPercent = values.contributionPercent as number
    const healthInsurance = values.healthInsurance as number
    const otherDeductions = values.otherDeductions as number

    const grossPerPeriod = annualSalary / payPeriods
    const fedTax = calculateFederalTax(annualSalary, taxYear2026, 'single')
    const fedPerPeriod = fedTax.totalTax / payPeriods
    const fica = calculateFICA(annualSalary, ficaRates)
    const ficaPerPeriod = fica.total / payPeriods
    const statePerPeriod = grossPerPeriod * (stateTaxRate / 100)
    const contribPerPeriod = grossPerPeriod * (contributionPercent / 100)
    const otherTotal = healthInsurance + otherDeductions
    const netPerPeriod = grossPerPeriod - fedPerPeriod - ficaPerPeriod - statePerPeriod - contribPerPeriod - otherTotal

    return {
      grossPay: formatCurrency(grossPerPeriod),
      federalTax: formatCurrency(fedPerPeriod),
      ficaSocialSecurity: formatCurrency(fica.socialSecurity / payPeriods),
      ficaMedicare: formatCurrency((fica.medicare + fica.additionalMedicare) / payPeriods),
      stateTax: formatCurrency(statePerPeriod),
      retirementContrib: formatCurrency(contribPerPeriod),
      healthInsurance: formatCurrency(healthInsurance),
      otherDeductions: formatCurrency(otherDeductions),
      netPay: formatCurrency(netPerPeriod),
      annualNetPay: formatCurrency(netPerPeriod * payPeriods),
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
          <h3 class="text-base sm:text-lg font-semibold text-foreground">Pay Period Breakdown</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultsDisplay label="Gross Pay per Period" value={result.grossPay} />
            <ResultsDisplay label="Federal Income Tax" value={result.federalTax} />
            <ResultsDisplay label="Social Security" value={result.ficaSocialSecurity} />
            <ResultsDisplay label="Medicare" value={result.ficaMedicare} />
            <ResultsDisplay label="State Income Tax" value={result.stateTax} />
            <ResultsDisplay label="401(k) Contribution" value={result.retirementContrib} />
            <ResultsDisplay label="Health Insurance" value={result.healthInsurance} />
            <ResultsDisplay label="Other Deductions" value={result.otherDeductions} />
          </div>
          <ResultsDisplay label="Net Pay (Take-Home) per Period" value={result.netPay} highlight />
          <ResultsDisplay label="Annual Net Pay" value={result.annualNetPay} />
        </div>
      )}
    </CalculatorForm>
  )
}
