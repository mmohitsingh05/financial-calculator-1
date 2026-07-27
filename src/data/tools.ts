export interface Tool {
  name: string
  slug: string
  category: ToolCategory
  tier: 'high' | 'medium' | 'low'
  description: string
}

export type ToolCategory =
  | 'loan'
  | 'investment'
  | 'retirement'
  | 'salary-tax'
  | 'general-finance'
  | 'real-estate'

export interface Category {
  id: ToolCategory
  name: string
  slug: string
}

export const categories: Category[] = [
  { id: 'loan', name: 'Loan Calculators', slug: 'loan' },
  { id: 'investment', name: 'Investment & Savings', slug: 'investment' },
  { id: 'retirement', name: 'Retirement Calculators', slug: 'retirement' },
  { id: 'salary-tax', name: 'Salary & Tax Calculators', slug: 'salary-tax' },
  { id: 'general-finance', name: 'General Finance', slug: 'general-finance' },
  { id: 'real-estate', name: 'Real Estate & Housing', slug: 'real-estate' },
]

export const tools: Tool[] = [
  { name: 'Mortgage Calculator', slug: 'mortgage-calculator', category: 'loan', tier: 'high', description: 'Estimate your monthly mortgage payment with PITI' },
  { name: 'Mortgage Refinance Calculator', slug: 'mortgage-refinance-calculator', category: 'loan', tier: 'medium', description: 'Compare your current vs. new loan payments' },
  { name: 'Auto Loan Calculator', slug: 'auto-loan-calculator', category: 'loan', tier: 'high', description: 'Calculate monthly car payments including trade-in' },
  { name: 'Personal Loan Calculator', slug: 'personal-loan-calculator', category: 'loan', tier: 'medium', description: 'Estimate personal loan payments with APR' },
  { name: 'Student Loan Calculator', slug: 'student-loan-calculator', category: 'loan', tier: 'high', description: 'Plan student loan repayment strategies' },
  { name: 'Amortization Calculator', slug: 'amortization-calculator', category: 'loan', tier: 'high', description: 'View full loan amortization schedule' },
  { name: 'Loan Payoff Calculator', slug: 'loan-payoff-calculator', category: 'loan', tier: 'medium', description: 'See how extra payments save interest' },
  { name: 'Debt-to-Income Ratio Calculator', slug: 'debt-to-income-calculator', category: 'loan', tier: 'medium', description: 'Calculate your front-end and back-end DTI' },
  { name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', category: 'investment', tier: 'high', description: 'See how your money grows with compounding' },
  { name: 'Simple Interest Calculator', slug: 'simple-interest-calculator', category: 'investment', tier: 'medium', description: 'Calculate simple interest on loans or savings' },
  { name: 'CD Calculator', slug: 'cd-calculator', category: 'investment', tier: 'medium', description: 'Estimate certificate of deposit returns' },
  { name: 'Investment Growth Calculator', slug: 'investment-growth-calculator', category: 'investment', tier: 'medium', description: 'Project investment growth over time' },
  { name: 'Dollar-Cost Averaging Calculator', slug: 'dollar-cost-averaging-calculator', category: 'investment', tier: 'low', description: 'Compare DCA vs. lump sum investing' },
  { name: 'Savings Goal Calculator', slug: 'savings-goal-calculator', category: 'investment', tier: 'medium', description: 'Find out how much to save monthly' },
  { name: '401(k) Calculator', slug: '401k-calculator', category: 'retirement', tier: 'high', description: 'Project 401(k) growth with employer match' },
  { name: 'Roth IRA Calculator', slug: 'roth-ira-calculator', category: 'retirement', tier: 'high', description: 'Estimate tax-free retirement growth' },
  { name: 'Traditional IRA Calculator', slug: 'traditional-ira-calculator', category: 'retirement', tier: 'medium', description: 'Calculate tax-deferred IRA growth' },
  { name: 'Retirement Savings Calculator', slug: 'retirement-calculator', category: 'retirement', tier: 'high', description: 'Are you saving enough for retirement?' },
  { name: 'Social Security Benefits Estimator', slug: 'social-security-calculator', category: 'retirement', tier: 'medium', description: 'Estimate your Social Security benefits' },
  { name: 'Paycheck Calculator', slug: 'paycheck-calculator', category: 'salary-tax', tier: 'high', description: 'Calculate your take-home pay after deductions' },
  { name: 'Salary Calculator', slug: 'salary-calculator', category: 'salary-tax', tier: 'high', description: 'Convert between hourly and annual salary' },
  { name: 'Hourly to Salary Calculator', slug: 'hourly-to-salary-calculator', category: 'salary-tax', tier: 'medium', description: 'Convert hourly wage to annual salary' },
  { name: 'Federal Income Tax Calculator', slug: 'income-tax-calculator', category: 'salary-tax', tier: 'high', description: 'Estimate your federal income tax refund' },
  { name: 'Net Worth Calculator', slug: 'net-worth-calculator', category: 'general-finance', tier: 'medium', description: 'Calculate your personal net worth' },
  { name: 'Inflation Calculator', slug: 'inflation-calculator', category: 'general-finance', tier: 'medium', description: 'See how inflation affects purchasing power' },
  { name: 'ROI Calculator', slug: 'roi-calculator', category: 'general-finance', tier: 'medium', description: 'Calculate return on investment (ROI)' },
  { name: 'Break-Even Point Calculator', slug: 'break-even-calculator', category: 'general-finance', tier: 'low', description: 'Find your business break-even point' },
  { name: 'Credit Card Payoff Calculator', slug: 'credit-card-payoff-calculator', category: 'general-finance', tier: 'high', description: 'See how long to pay off credit card debt' },
  { name: 'Debt Payoff Calculator', slug: 'debt-payoff-calculator', category: 'general-finance', tier: 'medium', description: 'Compare snowball vs. avalanche methods' },
  { name: 'Home Affordability Calculator', slug: 'home-affordability-calculator', category: 'real-estate', tier: 'high', description: 'How much house can you afford?' },
  { name: 'Rent vs. Buy Calculator', slug: 'rent-vs-buy-calculator', category: 'real-estate', tier: 'medium', description: 'Should you rent or buy a home?' },
]

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter(t => t.category === category)
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getRelatedTools(tool: Tool, count = 6): Tool[] {
  const sameCategory = tools.filter(t => t.category === tool.category && t.slug !== tool.slug)
  const others = tools.filter(t => t.category !== tool.category)
  return [...sameCategory, ...others].slice(0, count)
}