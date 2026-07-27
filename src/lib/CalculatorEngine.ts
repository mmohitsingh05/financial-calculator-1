export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function percentToDecimal(percent: number): number {
  return percent / 100
}

export function decimalToPercent(decimal: number): number {
  return decimal * 100
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export interface AmortizationResult {
  payment: number
  totalInterest: number
  totalPayment: number
  schedule: AmortizationRow[]
}

export interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  remainingBalance: number
}

export interface AmortizationInput {
  principal: number
  annualRate: number
  years: number
  paymentsPerYear?: number
}

export function solveAmortization(input: AmortizationInput): AmortizationResult {
  const { principal, annualRate, years, paymentsPerYear = 12 } = input
  const n = paymentsPerYear
  const N = years * n
  const i = percentToDecimal(annualRate) / n
  const schedule: AmortizationRow[] = []
  let balance = principal
  let totalInterest = 0

  const payment = i === 0
    ? principal / N
    : principal * (i * Math.pow(1 + i, N)) / (Math.pow(1 + i, N) - 1)

  for (let k = 1; k <= N; k++) {
    const interest = balance * i
    const principalPaid = payment - interest
    balance -= principalPaid
    totalInterest += interest
    schedule.push({
      period: k,
      payment,
      principal: principalPaid,
      interest,
      remainingBalance: Math.max(balance, 0),
    })
  }

  return {
    payment,
    totalInterest,
    totalPayment: principal + totalInterest,
    schedule,
  }
}

export interface PayoffSimulationInput {
  principal: number
  annualRate: number
  payment: number
  extraPayment?: number
  paymentsPerYear?: number
}

export interface PayoffResult {
  months: number
  totalInterest: number
  totalPayment: number
  originalMonths: number
  originalInterest: number
  interestSaved: number
}

export function simulateLoanPayoff(input: PayoffSimulationInput): PayoffResult {
  const { principal, annualRate, payment, extraPayment = 0, paymentsPerYear = 12 } = input
  const i = percentToDecimal(annualRate) / paymentsPerYear
  const totalPaymentPerPeriod = payment + extraPayment
  let balance = principal
  let months = 0
  let totalInterest = 0

  while (balance > 0 && months < 1200) {
    const interest = balance * i
    let principalPaid = totalPaymentPerPeriod - interest
    if (principalPaid <= 0) break
    if (principalPaid > balance) principalPaid = balance
    balance -= principalPaid
    totalInterest += interest
    months++
  }

  const origPayoff = solveAmortization({ principal, annualRate, years: 30, paymentsPerYear })
  const origMonths = 30 * paymentsPerYear
  const origInterest = origPayoff.totalInterest
  const actualPayment = totalPaymentPerPeriod * months
  const interestSaved = origInterest - totalInterest

  return {
    months,
    totalInterest,
    totalPayment: actualPayment,
    originalMonths: origMonths,
    originalInterest: origInterest,
    interestSaved,
  }
}

export interface DTIInput {
  monthlyHousing: number
  monthlyDebts: number
  grossMonthlyIncome: number
}

export interface DTIResult {
  frontEnd: number
  backEnd: number
}

export function calculateDTI(input: DTIInput): DTIResult {
  const frontEnd = (input.monthlyHousing / input.grossMonthlyIncome) * 100
  const backEnd = ((input.monthlyHousing + input.monthlyDebts) / input.grossMonthlyIncome) * 100
  return { frontEnd, backEnd }
}

export type CompoundingFrequency = 1 | 12 | 365

export interface FutureValueInput {
  presentValue: number
  annualRate: number
  years: number
  compoundingFrequency?: CompoundingFrequency
  periodicContribution?: number
}

export function calculateFutureValue(input: FutureValueInput): number {
  const { presentValue, annualRate, years, compoundingFrequency = 12, periodicContribution = 0 } = input
  const r = percentToDecimal(annualRate)
  const n = compoundingFrequency
  const nt = n * years
  const i = r / n

  const lumpSum = presentValue * Math.pow(1 + i, nt)
  const annuity = periodicContribution > 0 && i > 0
    ? periodicContribution * (Math.pow(1 + i, nt) - 1) / i
    : 0

  return lumpSum + annuity
}

export interface SavingsGoalInput {
  targetFV: number
  annualRate: number
  years: number
  compoundingFrequency?: CompoundingFrequency
  currentBalance?: number
}

export function solveSavingsPayment(input: SavingsGoalInput): number {
  const { targetFV, annualRate, years, compoundingFrequency = 12, currentBalance = 0 } = input
  const r = percentToDecimal(annualRate)
  const n = compoundingFrequency
  const nt = n * years
  const i = r / n

  const futureCurrent = currentBalance * Math.pow(1 + i, nt)
  const remainingNeeded = targetFV - futureCurrent

  if (remainingNeeded <= 0) return 0
  if (i === 0) return remainingNeeded / nt

  return remainingNeeded * i / (Math.pow(1 + i, nt) - 1)
}

export interface SimpleInterestInput {
  principal: number
  annualRate: number
  years: number
}

export function calculateSimpleInterest(input: SimpleInterestInput): { interest: number; total: number } {
  const interest = input.principal * percentToDecimal(input.annualRate) * input.years
  return { interest, total: input.principal + interest }
}

export interface ROIInput {
  initialInvestment: number
  finalValue: number
  years?: number
}

export function calculateROI(input: ROIInput): { roi: number; annualizedRoi: number | null } {
  const roi = ((input.finalValue - input.initialInvestment) / input.initialInvestment) * 100
  let annualizedRoi: number | null = null
  if (input.years && input.years > 0) {
    annualizedRoi = (Math.pow(input.finalValue / input.initialInvestment, 1 / input.years) - 1) * 100
  }
  return { roi, annualizedRoi }
}

export interface BreakEvenInput {
  fixedCosts: number
  pricePerUnit: number
  variableCostPerUnit: number
}

export interface BreakEvenResult {
  units: number
  revenue: number
  contributionMargin: number
  contributionMarginRatio: number
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const cm = input.pricePerUnit - input.variableCostPerUnit
  const units = cm > 0 ? input.fixedCosts / cm : Infinity
  return {
    units,
    revenue: units * input.pricePerUnit,
    contributionMargin: cm,
    contributionMarginRatio: cm / input.pricePerUnit,
  }
}

export interface CreditCardPayoffInput {
  balance: number
  apr: number
  monthlyPayment?: number
  useMinimumPayment?: boolean
  minPaymentPercent?: number
  minPaymentFlat?: number
}

export interface CreditCardPayoffResult {
  months: number
  totalInterest: number
  totalPaid: number
}

export function simulateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const { balance, apr, monthlyPayment, useMinimumPayment = false, minPaymentPercent = 0.02, minPaymentFlat = 25 } = input
  const i = percentToDecimal(apr) / 12
  let remaining = balance
  let months = 0
  let totalInterest = 0

  while (remaining > 0 && months < 1200) {
    const interest = remaining * i
    totalInterest += interest
    let payment = monthlyPayment || Math.max(remaining * minPaymentPercent, minPaymentFlat)
    if (useMinimumPayment) {
      payment = Math.max(remaining * minPaymentPercent, minPaymentFlat)
    }
    let principalPaid = payment - interest
    if (principalPaid <= 0) break
    if (principalPaid > remaining) principalPaid = remaining
    remaining -= principalPaid
    months++
  }

  return {
    months,
    totalInterest,
    totalPaid: balance + totalInterest,
  }
}

export interface DebtInfo {
  name: string
  balance: number
  apr: number
  minimumPayment: number
}

export interface DebtPayoffPlan {
  method: 'snowball' | 'avalanche'
  months: number
  totalInterest: number
  totalPaid: number
  payoffOrder: { name: string; months: number; interestPaid: number }[]
}

export function simulateDebtPayoff(debts: DebtInfo[], extraMonthly: number, method: 'snowball' | 'avalanche'): DebtPayoffPlan {
  const sorted = [...debts].sort((a, b) =>
    method === 'avalanche' ? b.apr - a.apr : a.balance - b.balance
  )

  let balance = sorted.map(d => d.balance)
  const minPay = sorted.map(d => d.minimumPayment)
  const rates = sorted.map(d => percentToDecimal(d.apr) / 12)
  let months = 0
  let totalInterest = 0
  const payoffOrder: { name: string; months: number; interestPaid: number }[] = []

  while (balance.some(b => b > 0) && months < 1200) {
    let extra = extraMonthly
    for (let i = 0; i < balance.length; i++) {
      if (balance[i] <= 0) continue
      const interest = balance[i] * rates[i]
      totalInterest += interest
      let payment = minPay[i]
      if (extra > 0) {
        payment += extra
        extra = 0
      }
      let principalPaid = payment - interest
      if (principalPaid >= balance[i]) {
        extra += (principalPaid - balance[i])
        payoffOrder.push({ name: sorted[i].name, months, interestPaid: totalInterest })
        balance[i] = 0
      } else {
        balance[i] -= principalPaid
      }
    }
    months++
  }

  return {
    method,
    months,
    totalInterest,
    totalPaid: debts.reduce((s, d) => s + d.balance, 0) + totalInterest,
    payoffOrder,
  }
}

export function calculateInflation(amount: number, rate: number, years: number): { futureValue: number; pastValue: number } {
  const r = percentToDecimal(rate)
  const futureValue = amount * Math.pow(1 + r, years)
  const pastValue = amount / Math.pow(1 + r, years)
  return { futureValue, pastValue }
}

export interface HomeAffordabilityInput {
  grossMonthlyIncome: number
  monthlyDebts: number
  downPayment: number
  annualRate: number
  loanYears: number
  annualTaxRate: number
  annualInsurance: number
  monthlyHOA?: number
}

export function calculateHomeAffordability(input: HomeAffordabilityInput): {
  maxHomePrice: number
  maxLoanAmount: number
  monthlyPayment: number
  frontEndLimit: number
  backEndLimit: number
} {
  const frontEndLimit = input.grossMonthlyIncome * 0.28
  const backEndLimit = input.grossMonthlyIncome * 0.36
  const maxHousing = Math.min(frontEndLimit, backEndLimit - input.monthlyDebts)

  const monthlyTax = (input.maxHomePrice * input.annualTaxRate) / 12
  const monthlyInsurance = input.annualInsurance / 12
  const hoa = input.monthlyHOA || 0
  const availableForMortgage = maxHousing - monthlyTax - monthlyInsurance - hoa

  const i = percentToDecimal(input.annualRate) / 12
  const N = input.loanYears * 12

  const maxLoan = i === 0
    ? availableForMortgage * N
    : availableForMortgage * (Math.pow(1 + i, N) - 1) / (i * Math.pow(1 + i, N))

  const maxPrice = maxLoan + input.downPayment

  const amortResult = solveAmortization({ principal: maxLoan, annualRate: input.annualRate, years: input.loanYears })

  return {
    maxHomePrice: maxPrice,
    maxLoanAmount: maxLoan,
    monthlyPayment: amortResult.payment + monthlyTax + monthlyInsurance + hoa,
    frontEndLimit,
    backEndLimit,
  }
}

export interface RentVsBuyInput {
  monthlyRent: number
  annualRentIncrease: number
  homePrice: number
  downPaymentPercent: number
  annualRate: number
  loanYears: number
  annualTaxRate: number
  annualInsurance: number
  annualMaintenancePercent: number
  closingCostsPercent: number
  annualAppreciation: number
  investmentReturn: number
  holdingYears: number
  sellingCostPercent: number
}

export interface RentVsBuyResult {
  totalRentCost: number
  opportunityCostDown: number
  totalBuyingCost: number
  netEquity: number
  buyBetter: boolean
  breakEvenYear?: number
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const downPayment = input.homePrice * (input.downPaymentPercent / 100)
  const loanAmount = input.homePrice - downPayment
  const amort = solveAmortization({ principal: loanAmount, annualRate: input.annualRate, years: input.loanYears })

  const closingCosts = input.homePrice * (input.closingCostsPercent / 100)

  let totalRent = 0
  for (let y = 0; y < input.holdingYears; y++) {
    totalRent += input.monthlyRent * 12 * Math.pow(1 + input.annualRentIncrease / 100, y)
  }

  const opportunityCostDown = downPayment * Math.pow(1 + input.investmentReturn / 100, input.holdingYears) - downPayment

  const totalMortgagePaid = amort.payment * amort.schedule.length
  const totalTaxPaid = (input.homePrice * input.annualTaxRate / 100) * input.holdingYears
  const totalInsurancePaid = input.annualInsurance * input.holdingYears
  const totalMaintenance = (input.homePrice * input.annualMaintenancePercent / 100) * input.holdingYears

  const homeValueAtEnd = input.homePrice * Math.pow(1 + input.annualAppreciation / 100, input.holdingYears)
  const appreciationGain = homeValueAtEnd - input.homePrice

  let equity = downPayment
  for (let m = 0; m < Math.min(input.holdingYears * 12, amort.schedule.length); m++) {
    equity += amort.schedule[m].principal
  }

  const remainingBalance = Math.max(0, loanAmount - (equity - downPayment))
  const sellingCosts = homeValueAtEnd * (input.sellingCostPercent / 100)
  const netProceeds = homeValueAtEnd - remainingBalance - sellingCosts

  const totalBuyingCost = downPayment + totalMortgagePaid + totalTaxPaid + totalInsurancePaid + totalMaintenance + closingCosts
  const netBuyingCost = totalBuyingCost - appreciationGain - (netProceeds > downPayment ? netProceeds - downPayment : 0)

  const totalRentCost = totalRent + opportunityCostDown

  let breakEvenYear: number | undefined
  for (let y = 1; y <= input.holdingYears; y++) {
    let rentToDate = 0
    for (let ry = 0; ry < y; ry++) {
      rentToDate += input.monthlyRent * 12 * Math.pow(1 + input.annualRentIncrease / 100, ry)
    }
    const oppCostToDate = downPayment * Math.pow(1 + input.investmentReturn / 100, y) - downPayment
    const totalRentToDate = rentToDate + oppCostToDate

    const hValue = input.homePrice * Math.pow(1 + input.annualAppreciation / 100, y)
    const pmi = 0
    const taxPaid = (input.homePrice * input.annualTaxRate / 100) * y
    const insPaid = input.annualInsurance * y
    const maint = (input.homePrice * input.annualMaintenancePercent / 100) * y
    let eq = downPayment
    const amortTemp = solveAmortization({ principal: loanAmount, annualRate: input.annualRate, years: input.loanYears })
    for (let m = 0; m < Math.min(y * 12, amortTemp.schedule.length); m++) {
      eq += amortTemp.schedule[m].principal
    }
    const rBal = Math.max(0, loanAmount - (eq - downPayment))
    const sCost = hValue * (input.sellingCostPercent / 100)
    const nProc = hValue - rBal - sCost
    const buyCost = downPayment + amortTemp.payment * y * 12 + taxPaid + insPaid + maint + closingCosts
    const nBuyCost = buyCost - (hValue - input.homePrice) - (nProc - downPayment)

    if (nBuyCost < totalRentToDate) {
      breakEvenYear = y
      break
    }
  }

  return {
    totalRentCost,
    opportunityCostDown,
    totalBuyingCost: netBuyingCost,
    netEquity: equity,
    buyBetter: netBuyingCost < totalRentCost,
    breakEvenYear,
  }
}

export type TaxFilingStatus = 'single' | 'married-filing-jointly' | 'married-filing-separately' | 'head-of-household'

export interface TaxBracket {
  lower: number
  upper: number
  rate: number
}

export interface TaxYearConfig {
  year: number
  brackets: Record<TaxFilingStatus, TaxBracket[]>
  standardDeduction: Record<TaxFilingStatus, number>
}

export function calculateFederalTax(income: number, config: TaxYearConfig, status: TaxFilingStatus): {
  taxableIncome: number
  totalTax: number
  effectiveRate: number
  marginalRate: number
} {
  const standardDeduction = config.standardDeduction[status]
  const taxableIncome = Math.max(0, income - standardDeduction)
  const brackets = config.brackets[status]

  let totalTax = 0
  let marginalRate = 0
  for (const bracket of brackets) {
    if (taxableIncome > bracket.lower) {
      const taxableInBracket = Math.min(taxableIncome, bracket.upper) - bracket.lower
      if (taxableInBracket > 0) {
        totalTax += taxableInBracket * bracket.rate
        marginalRate = bracket.rate
      }
    }
  }

  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0

  return { taxableIncome, totalTax, effectiveRate, marginalRate }
}

export interface FICAInput {
  wages: number
  year: number
}

export interface FICARates {
  socialSecurityRate: number
  socialSecurityWageBase: number
  medicareRate: number
  additionalMedicareRate: number
  additionalMedicareThreshold: number
}

export function calculateFICA(wages: number, rates: FICARates): { socialSecurity: number; medicare: number; additionalMedicare: number; total: number } {
  const socialSecurity = Math.min(wages, rates.socialSecurityWageBase) * rates.socialSecurityRate
  const medicare = wages * rates.medicareRate
  const additionalMedicare = wages > rates.additionalMedicareThreshold
    ? (wages - rates.additionalMedicareThreshold) * rates.additionalMedicareRate
    : 0
  return {
    socialSecurity,
    medicare,
    additionalMedicare,
    total: socialSecurity + medicare + additionalMedicare,
  }
}

export function calculatePaycheck(
  annualSalary: number,
  payPeriods: number,
  federalTax: number,
  ficaTotal: number,
  stateTax: number,
  otherDeductions: number,
): { grossPay: number; netPay: number; totalDeductions: number } {
  const grossPay = annualSalary / payPeriods
  const totalDeductions = (federalTax + ficaTotal + stateTax + otherDeductions) / payPeriods
  return {
    grossPay,
    netPay: grossPay - totalDeductions,
    totalDeductions,
  }
}

export function convertSalary(hourly: number, hoursPerWeek: number, weeksPerYear: number): {
  annual: number
  monthly: number
  biweekly: number
  weekly: number
  daily: number
} {
  const annual = hourly * hoursPerWeek * weeksPerYear
  return {
    annual,
    monthly: annual / 12,
    biweekly: annual / 26,
    weekly: annual / 52,
    daily: annual / (weeksPerYear * 5),
  }
}

export function calculateHourlyToSalary(annual: number, hoursPerWeek: number, weeksPerYear: number, overtimeHours = 0): {
  hourlyRate: number
  overtimeRate: number
  weeklyPay: number
} {
  const hourlyRate = annual / (hoursPerWeek * weeksPerYear)
  const overtimeRate = hourlyRate * 1.5
  const weeklyPay = (Math.min(hoursPerWeek, 40) * hourlyRate) + (overtimeHours * overtimeRate)
  return { hourlyRate, overtimeRate, weeklyPay }
}

export function calculateNetWorth(assets: number[], liabilities: number[]): number {
  const totalAssets = assets.reduce((s, a) => s + a, 0)
  const totalLiabilities = liabilities.reduce((s, l) => s + l, 0)
  return totalAssets - totalLiabilities
}

export function estimateSocialSecurity(
  fullRetirementBenefit: number,
  claimAge: number,
  fullRetirementAge: number,
): number {
  if (claimAge >= fullRetirementAge) {
    const monthsAfter = Math.min((claimAge - fullRetirementAge) * 12, 36)
    return fullRetirementBenefit * (1 + (monthsAfter * (2 / 3) / 100))
  } else {
    const monthsEarly = (fullRetirementAge - claimAge) * 12
    if (monthsEarly <= 36) {
      return fullRetirementBenefit * (1 - (monthsEarly * (5 / 9) / 100))
    } else {
      const first36 = 36 * (5 / 9) / 100
      const beyond = (monthsEarly - 36) * (5 / 12) / 100
      return fullRetirementBenefit * (1 - first36 - beyond)
    }
  }
}

export function calculate401k(
  currentBalance: number,
  salary: number,
  employeeContributionPercent: number,
  employerMatchRate: number,
  employerMatchCap: number,
  annualReturn: number,
  years: number,
  annualContributionLimit: number,
): { futureValue: number; totalContributions: number; employerMatchTotal: number } {
  const employeeAnnual = Math.min(salary * (employeeContributionPercent / 100), annualContributionLimit)
  const employerAnnual = Math.min(employeeAnnual * employerMatchRate, salary * (employerMatchCap / 100))
  const totalAnnual = employeeAnnual + employerAnnual
  const r = percentToDecimal(annualReturn)
  const monthlyRate = r / 12
  const totalMonths = years * 12
  const monthlyContribution = totalAnnual / 12

  const fv = currentBalance * Math.pow(1 + monthlyRate, totalMonths) +
    monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate

  return {
    futureValue: fv,
    totalContributions: employeeAnnual * years,
    employerMatchTotal: employerAnnual * years,
  }
}

export function calculateRetirementWithdrawal(
  savingsAtRetirement: number,
  safeWithdrawalRate: number,
  annualReturn: number,
  annualWithdrawal: number,
): { sustainableIncome: number; yearsLasts: number | 'indefinite' } {
  const sustainableIncome = savingsAtRetirement * (safeWithdrawalRate / 100)
  const r = percentToDecimal(annualReturn)
  if (annualWithdrawal <= savingsAtRetirement * r) {
    return { sustainableIncome, yearsLasts: 'indefinite' }
  }
  const years = -Math.log(1 - (savingsAtRetirement * r) / annualWithdrawal) / Math.log(1 + r)
  return { sustainableIncome, yearsLasts: Math.ceil(years) }
}