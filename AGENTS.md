# AGENTS.md — U.S. Finance & Loan Calculator Tools Website (Merged Master Spec)

This is the single master build file for this project — merged from the original `AGENTS.md` (site/SEO spec) and `FORMULAS.md` (calculation logic) into one document so nothing has to be cross-referenced across two files. Updated for **Astro.js + Cloudflare Pages** (previously specced for Next.js + Vercel/Netlify — that stack is fully replaced below). Follow this file exactly. Do not skip the SEO/indexing requirements — they are as important as the calculator logic itself.

---

## 1. Project Summary

**What we're building:** A U.S.-audience website offering 31 free financial calculators, organized under one authority domain, cross-linked for SEO, fully indexable, fast, and mobile-first.

**Important correction from the original brief:** The original 30-tool list mixed in India-specific financial products (EMI, PPF, NPS, HRA, Gratuity, EPF, CTC, FD, RD, Lumpsum/SIP) that a U.S. audience does not search for and that have no U.S. tax/legal equivalent. Those terms have been swapped for the closest real U.S. financial instruments (see Section 5), keeping the count at 30 core tools + Rent vs. Buy (31 total), and keeping the same categories (loans, investments, retirement, salary/tax, general finance, real estate).

**Target audience:** United States, English, desktop + mobile, informational + transactional search intent (people about to take a loan, buy a house, plan retirement, or check their paycheck).

**Monetization:** Google AdSense / Ezoic / Mediavine display ads + optional affiliate (lenders, IRA/brokerage referral links) once traffic qualifies.

---

## 2. Tech Stack — Astro.js + Cloudflare Pages

- **Framework:** Astro.js (latest stable), `static` output for every page in this project. There is no live-data tool in this 31-tool set (all math is public formulas computed in-browser) — no Cloudflare Pages Function is required anywhere in this project.
- **Interactivity:** Astro Islands via `@astrojs/preact` for each calculator widget — Preact keeps bundle size minimal since these are simple form + calculation UIs, not complex app state. Only the calculator "island" hydrates; the rest of each page (copy, FAQ, formula explanation) ships as zero-JS static HTML.
- **Styling:** Tailwind CSS (`@astrojs/tailwind`).
- **Content layer:** Astro Content Collections (`src/content/tools/*.md` or `.mdx`) — one entry per tool holding its copy, FAQ, and metadata, so the keyword/FAQ data in Section 7 maps 1:1 to a content file per tool.
- **Deployment:** Cloudflare Pages, connected to the git repo, auto-deploy on push to `main`. Enable Cloudflare's Auto Minify (HTML/CSS/JS) and Brotli compression in the dashboard; use Cloudflare caching rules to cache these static tool pages aggressively at the edge (they rarely change).
- **Analytics:** Cloudflare Web Analytics (free, cookie-less, no Core Web Vitals cost) or Google Analytics 4 + Google Search Console + Bing Webmaster Tools (mandatory, see Section 9).
- **Schema:** JSON-LD injected per-page via a shared `<SchemaOrg />` Astro component (see Section 6).

Agents building this: default every tool page to Astro's `static` output so pages are pre-rendered HTML, not client-only JS shells — this is critical for indexing. Reuse one shared calculation-engine pattern (input schema → formula function → formatted output) across all 31 tools (see Section 8 for every formula) so new calculators are fast to add without duplicating boilerplate.

---

## 3. Site Architecture & URL Structure

```
/                                   → Homepage (landing page, links to all 31 tools + 6 categories)
/calculators/                       → All-tools directory page (sitemap-style page for users)
/calculators/loan/                  → Category hub: Loan Calculators
/calculators/investment/            → Category hub: Investment & Savings Calculators
/calculators/retirement/            → Category hub: Retirement Calculators
/calculators/salary-tax/            → Category hub: Salary & Tax Calculators
/calculators/general-finance/       → Category hub: General Finance Calculators
/calculators/real-estate/           → Category hub: Real Estate & Housing Calculators

/calculators/[category]/[tool-slug] → Individual calculator page (31 total)
   e.g. /calculators/loan/mortgage-calculator
   e.g. /calculators/retirement/401k-calculator

/blog/                              → Supporting articles (optional but recommended for topical authority)
/blog/[slug]

/about/
/contact/
/privacy-policy/
/terms-of-service/
/disclaimer/                        → REQUIRED for finance sites (not financial advice)
/sitemap-index.xml                  → via @astrojs/sitemap integration, auto-generated on every build
/robots.txt
```

**Rule:** every calculator lives at exactly one canonical URL, nested under its category. Never create duplicate URLs for the same tool (e.g. no `/mortgage-calculator` AND `/calculators/mortgage-calculator` both existing — pick one and 301 redirect the rest, configured via Cloudflare Bulk Redirects or Page Rules).

---

## 4. Navigation (Mega Menu) Structure

Header nav has one item: **"Calculators"** → opens mega menu with 6 columns (one per category), each listing its tools as direct links (not just the category page). Footer repeats every tool link again in a sitemap-style block (this is a major internal-linking win — every tool becomes reachable in ≤2 clicks from every page).

```
CALCULATORS (mega menu, 6 columns)
├── Loan Calculators                 ├── Investment & Savings
│   ├── Mortgage Calculator          │   ├── Compound Interest Calculator
│   ├── Mortgage Refinance Calc.     │   ├── Simple Interest Calculator
│   ├── Auto Loan Calculator         │   ├── CD Calculator
│   ├── Personal Loan Calculator     │   ├── Investment Growth Calculator
│   ├── Student Loan Calculator      │   ├── Dollar-Cost Averaging Calc.
│   ├── Amortization Calculator      │   └── Savings Goal Calculator
│   ├── Loan Payoff Calculator       │
│   └── Debt-to-Income Calculator    ├── Retirement
│                                    │   ├── 401(k) Calculator
├── Salary & Tax                     │   ├── Roth IRA Calculator
│   ├── Paycheck Calculator          │   ├── Traditional IRA Calculator
│   ├── Salary Calculator            │   ├── Retirement Savings Calculator
│   ├── Hourly to Salary Calculator  │   └── Social Security Estimator
│   └── Federal Income Tax Calc.     │
│                                    ├── Real Estate & Housing
├── General Finance                  │   ├── Home Affordability Calculator
│   ├── Net Worth Calculator         │   └── Rent vs. Buy Calculator
│   ├── Inflation Calculator         │
│   ├── ROI Calculator               │
│   ├── Break-Even Point Calculator  │
│   ├── Credit Card Payoff Calc.     │
│   └── Debt Payoff Calculator       │
```

Each mega-menu column header links to its category hub page; each tool name links directly to its calculator page.

---

## 5. The 31 Calculators — Final U.S.-Adapted List

| # | Category | Tool Name | URL slug | Replaces (from original brief) |
|---|----------|-----------|----------|----------------------------------|
| 1 | Loan | Mortgage Calculator | `mortgage-calculator` | Home Loan EMI |
| 2 | Loan | Mortgage Refinance Calculator | `mortgage-refinance-calculator` | — (new, high US demand) |
| 3 | Loan | Auto Loan Calculator | `auto-loan-calculator` | Car Loan EMI |
| 4 | Loan | Personal Loan Calculator | `personal-loan-calculator` | Personal Loan EMI |
| 5 | Loan | Student Loan Calculator | `student-loan-calculator` | — (new, huge US demand) |
| 6 | Loan | Amortization Calculator | `amortization-calculator` | Amortization Calculator |
| 7 | Loan | Loan Payoff Calculator | `loan-payoff-calculator` | Loan Prepayment Calculator |
| 8 | Loan | Debt-to-Income Ratio Calculator | `debt-to-income-calculator` | Debt-to-Income Calculator |
| 9 | Investment | Compound Interest Calculator | `compound-interest-calculator` | Compound Interest Calculator |
| 10 | Investment | Simple Interest Calculator | `simple-interest-calculator` | Simple Interest Calculator |
| 11 | Investment | CD Calculator | `cd-calculator` | FD Calculator |
| 12 | Investment | Investment Growth Calculator | `investment-growth-calculator` | Lumpsum Calculator |
| 13 | Investment | Dollar-Cost Averaging Calculator | `dollar-cost-averaging-calculator` | SIP Calculator |
| 14 | Investment | Savings Goal Calculator | `savings-goal-calculator` | RD Calculator |
| 15 | Retirement | 401(k) Calculator | `401k-calculator` | EPF Calculator / NPS Calculator |
| 16 | Retirement | Roth IRA Calculator | `roth-ira-calculator` | PPF Calculator |
| 17 | Retirement | Traditional IRA Calculator | `traditional-ira-calculator` | — (new) |
| 18 | Retirement | Retirement Savings Calculator | `retirement-calculator` | Retirement Calculator |
| 19 | Retirement | Social Security Benefits Estimator | `social-security-calculator` | Gratuity Calculator |
| 20 | Salary & Tax | Paycheck / Take-Home Pay Calculator | `paycheck-calculator` | In-hand Salary Calculator |
| 21 | Salary & Tax | Salary Calculator | `salary-calculator` | Salary Calculator |
| 22 | Salary & Tax | Hourly to Salary Calculator | `hourly-to-salary-calculator` | CTC Calculator |
| 23 | Salary & Tax | Federal Income Tax Calculator | `income-tax-calculator` | HRA Calculator |
| 24 | General Finance | Net Worth Calculator | `net-worth-calculator` | Net Worth Calculator |
| 25 | General Finance | Inflation Calculator | `inflation-calculator` | Inflation Calculator |
| 26 | General Finance | ROI Calculator | `roi-calculator` | ROI Calculator |
| 27 | General Finance | Break-Even Point Calculator | `break-even-calculator` | Break-even Calculator |
| 28 | General Finance | Credit Card Payoff Calculator | `credit-card-payoff-calculator` | Credit Card Interest Calculator |
| 29 | General Finance | Debt Payoff Calculator (Snowball/Avalanche) | `debt-payoff-calculator` | — (new) |
| 30 | Real Estate | Home Affordability Calculator | `home-affordability-calculator` | Loan Eligibility Calculator |
| 31 | Real Estate | Rent vs. Buy Calculator | `rent-vs-buy-calculator` | Rent vs Buy Calculator |

Note: Real Estate has 2 tools, Salary & Tax has 4 — total is still 31. Category groupings in the mega menu (Section 4) reflect this.

---

## 6. On-Page SEO Requirements (apply to every single calculator page)

Every tool page MUST have:

1. **Title tag formula:** `[Tool Name] – [Primary Benefit] | [Brand Name]`
   e.g. `Mortgage Calculator – Estimate Your Monthly Payment | [Brand]`
2. **Meta description:** 150–160 characters, includes primary keyword + a number/benefit + CTA.
3. **H1:** Matches the tool name exactly (only one H1 per page).
4. **Intro paragraph (100–150 words):** above the calculator widget, containing the primary keyword naturally in the first sentence.
5. **The calculator tool itself** (interactive, client-side, Astro island).
6. **"How to use this calculator" section** (H2) — 3–5 steps.
7. **"How [X] is calculated" section** (H2) — show the actual formula from Section 8, builds topical trust (E-E-A-T).
8. **FAQ section** (H2, 4–6 Q&As) — see Section 7. Wrap in `FAQPage` schema.
9. **Related calculators block** (H2) — auto-linked 4–6 other tools from the same category = internal linking engine.
10. **Breadcrumbs:** `Home > Calculators > [Category] > [Tool Name]` with `BreadcrumbList` schema.
11. **Schema markup:** `WebApplication` or `SoftwareApplication` schema + `FAQPage` schema + `BreadcrumbList` schema on every tool page.
12. **Canonical tag:** self-referencing canonical on every page (prevents duplicate content issues from any URL params the calculator might use).
13. **Alt text** on any illustrative image/icon.
14. **Financial disclaimer** footer note: "This calculator is for informational purposes only and does not constitute financial advice," linking to `/disclaimer/`.

---

## 7. Primary/Secondary Keywords & FAQs (per tool)

Note on methodology: exact monthly search volumes must be pulled live from Ahrefs Keyword Generator (`https://ahrefs.com/keyword-generator/?country=us&input=`) or Ahrefs Keywords Explorer before writing final copy — that tool requires an interactive query per seed and doesn't expose bulk data via static fetch, so the volumes below are directional tiers (High = 10K+/mo, Medium = 1K–10K/mo, Low = under 1K/mo, U.S. only) based on known market size, not exact numbers. Re-verify each before publishing.

### Loan Calculators

**1. Mortgage Calculator** (`mortgage-calculator`) — Tier: High
- Primary keyword: `mortgage calculator`
- Secondary: `mortgage payment calculator`, `home loan calculator`, `monthly mortgage calculator`, `mortgage calculator with taxes and insurance`, `30 year mortgage calculator`
- FAQs: What's included in my monthly mortgage payment? How much house can I afford based on my income? What's the difference between a 15-year and 30-year mortgage payment? Does this calculator include property taxes and homeowners insurance?

**2. Mortgage Refinance Calculator** (`mortgage-refinance-calculator`) — Tier: Medium
- Primary: `mortgage refinance calculator`
- Secondary: `refinance calculator`, `should I refinance my mortgage`, `refinance savings calculator`, `break-even refinance calculator`
- FAQs: When does refinancing make sense? How much does refinancing cost? How long until refinancing pays for itself?

**3. Auto Loan Calculator** (`auto-loan-calculator`) — Tier: High
- Primary: `auto loan calculator`
- Secondary: `car loan calculator`, `car payment calculator`, `auto loan payment calculator`, `car finance calculator`
- FAQs: How is my monthly car payment calculated? Does a longer loan term save money? What's a good interest rate for an auto loan?

**4. Personal Loan Calculator** (`personal-loan-calculator`) — Tier: Medium-High
- Primary: `personal loan calculator`
- Secondary: `loan payment calculator`, `personal loan payment calculator`, `unsecured loan calculator`
- FAQs: What determines my personal loan interest rate? Is a personal loan better than a credit card? How is APR different from interest rate?

**5. Student Loan Calculator** (`student-loan-calculator`) — Tier: High
- Primary: `student loan calculator`
- Secondary: `student loan payment calculator`, `student loan interest calculator`, `federal student loan calculator`, `student loan payoff calculator`
- FAQs: How is student loan interest calculated? What's the difference between subsidized and unsubsidized loans? How can I pay off student loans faster?

**6. Amortization Calculator** (`amortization-calculator`) — Tier: High
- Primary: `amortization calculator`
- Secondary: `loan amortization schedule`, `mortgage amortization calculator`, `amortization table calculator`
- FAQs: What is a loan amortization schedule? Why do I pay more interest early in a loan? Can I download my amortization schedule?

**7. Loan Payoff Calculator** (`loan-payoff-calculator`) — Tier: Medium
- Primary: `loan payoff calculator`
- Secondary: `early loan payoff calculator`, `extra payment calculator`, `loan prepayment calculator`
- FAQs: How much can I save by paying extra toward my loan? Are there prepayment penalties? How does one extra payment a year affect payoff time?

**8. Debt-to-Income Ratio Calculator** (`debt-to-income-calculator`) — Tier: Medium
- Primary: `debt to income ratio calculator`
- Secondary: `DTI calculator`, `debt to income calculator mortgage`, `what is a good debt to income ratio`
- FAQs: What DTI ratio do lenders want for a mortgage? How is DTI calculated? How can I lower my debt-to-income ratio?

### Investment & Savings Calculators

**9. Compound Interest Calculator** (`compound-interest-calculator`) — Tier: High
- Primary: `compound interest calculator`
- Secondary: `compound interest calculator monthly`, `daily compound interest calculator`, `investment compound interest calculator`
- FAQs: What's the difference between simple and compound interest? How often should interest compound for best growth? How does compounding frequency affect returns?

**10. Simple Interest Calculator** (`simple-interest-calculator`) — Tier: Medium
- Primary: `simple interest calculator`
- Secondary: `simple interest loan calculator`, `simple interest formula calculator`
- FAQs: How is simple interest different from compound interest? What loans use simple interest?

**11. CD Calculator** (`cd-calculator`) — Tier: Medium
- Primary: `CD calculator`
- Secondary: `certificate of deposit calculator`, `CD interest calculator`, `CD rate calculator`
- FAQs: How is CD interest paid out? What happens if I withdraw early? Are CDs better than savings accounts?

**12. Investment Growth Calculator** (`investment-growth-calculator`) — Tier: Medium
- Primary: `investment calculator`
- Secondary: `investment growth calculator`, `lump sum investment calculator`, `compound investment calculator`
- FAQs: How much will my investment be worth in 10/20/30 years? What average return should I assume? Does this account for inflation?

**13. Dollar-Cost Averaging Calculator** (`dollar-cost-averaging-calculator`) — Tier: Low-Medium
- Primary: `dollar cost averaging calculator`
- Secondary: `DCA calculator`, `recurring investment calculator`, `monthly investment calculator`
- FAQs: What is dollar-cost averaging? Is DCA better than investing a lump sum? How much should I invest monthly?

**14. Savings Goal Calculator** (`savings-goal-calculator`) — Tier: Medium
- Primary: `savings calculator`
- Secondary: `savings goal calculator`, `how much to save monthly calculator`, `emergency fund calculator`
- FAQs: How much should I save each month to reach my goal? How big should my emergency fund be?

### Retirement Calculators

**15. 401(k) Calculator** (`401k-calculator`) — Tier: High
- Primary: `401k calculator`
- Secondary: `401k contribution calculator`, `401k growth calculator`, `401k retirement calculator`, `employer match calculator`
- FAQs: How much should I contribute to my 401(k)? What is an employer match and how does it work? What's the 401(k) contribution limit this year?

**16. Roth IRA Calculator** (`roth-ira-calculator`) — Tier: High
- Primary: `Roth IRA calculator`
- Secondary: `Roth IRA growth calculator`, `Roth IRA contribution limits`, `Roth IRA vs traditional IRA calculator`
- FAQs: What's the difference between a Roth and Traditional IRA? What are the income limits for Roth IRA contributions? How much can I contribute to a Roth IRA this year?

**17. Traditional IRA Calculator** (`traditional-ira-calculator`) — Tier: Medium
- Primary: `traditional IRA calculator`
- Secondary: `IRA calculator`, `IRA growth calculator`, `IRA tax deduction calculator`
- FAQs: Are Traditional IRA contributions tax-deductible? When can I withdraw without penalty? What's the required minimum distribution (RMD)?

**18. Retirement Savings Calculator** (`retirement-calculator`) — Tier: High
- Primary: `retirement calculator`
- Secondary: `retirement savings calculator`, `how much do I need to retire calculator`, `retirement age calculator`
- FAQs: How much do I need saved to retire comfortably? What's the 4% withdrawal rule? How does inflation affect my retirement savings?

**19. Social Security Benefits Estimator** (`social-security-calculator`) — Tier: Medium-High
- Primary: `social security calculator`
- Secondary: `social security benefits estimator`, `when to claim social security calculator`, `social security retirement calculator`
- FAQs: At what age should I claim Social Security? How is my benefit amount calculated? Does working while claiming reduce my benefits?

### Salary & Tax Calculators

**20. Paycheck Calculator** (`paycheck-calculator`) — Tier: High
- Primary: `paycheck calculator`
- Secondary: `take home pay calculator`, `net pay calculator`, `salary paycheck calculator`, `payroll calculator`
- FAQs: What's the difference between gross and net pay? What deductions come out of my paycheck? How do I estimate my take-home pay by state?

**21. Salary Calculator** (`salary-calculator`) — Tier: High
- Primary: `salary calculator`
- Secondary: `annual salary calculator`, `salary to hourly calculator`, `pay raise calculator`
- FAQs: How do I convert hourly wage to annual salary? What's considered a good salary in my state? How is overtime calculated?

**22. Hourly to Salary Calculator** (`hourly-to-salary-calculator`) — Tier: Medium
- Primary: `hourly to salary calculator`
- Secondary: `hourly wage calculator`, `salary to hourly calculator`, `annual income calculator`
- FAQs: How many work hours are in a year? How do I calculate annual salary from hourly rate? Does this include overtime pay?

**23. Federal Income Tax Calculator** (`income-tax-calculator`) — Tier: High
- Primary: `income tax calculator`
- Secondary: `federal tax calculator`, `tax bracket calculator`, `income tax estimator`, `2026 tax calculator`
- FAQs: What tax bracket am I in? What's the difference between marginal and effective tax rate? Standard deduction vs. itemized — which should I choose?

### General Finance Calculators

**24. Net Worth Calculator** (`net-worth-calculator`) — Tier: Medium
- Primary: `net worth calculator`
- Secondary: `personal net worth calculator`, `how to calculate net worth`, `average net worth by age`
- FAQs: What counts as an asset vs. a liability? What's a good net worth for my age? How often should I track my net worth?

**25. Inflation Calculator** (`inflation-calculator`) — Tier: Medium
- Primary: `inflation calculator`
- Secondary: `CPI inflation calculator`, `inflation calculator by year`, `dollar value calculator`
- FAQs: How is inflation measured (CPI)? What was $1 worth 20 years ago? How does inflation affect my savings?

**26. ROI Calculator** (`roi-calculator`) — Tier: Medium
- Primary: `ROI calculator`
- Secondary: `return on investment calculator`, `investment return calculator`, `annualized return calculator`
- FAQs: How is ROI calculated? What's a good ROI for an investment? ROI vs. annualized return — what's the difference?

**27. Break-Even Point Calculator** (`break-even-calculator`) — Tier: Low-Medium
- Primary: `break even calculator`
- Secondary: `break even point calculator`, `break even analysis calculator`, `business break even calculator`
- FAQs: What's the break-even formula? How do fixed and variable costs affect break-even point? Why does break-even analysis matter for a new business?

**28. Credit Card Payoff Calculator** (`credit-card-payoff-calculator`) — Tier: High
- Primary: `credit card payoff calculator`
- Secondary: `credit card interest calculator`, `credit card debt calculator`, `minimum payment calculator`
- FAQs: How long will it take to pay off my credit card at minimum payments? How much interest will I pay total? How much faster can I pay it off with extra payments?

**29. Debt Payoff Calculator (Snowball/Avalanche)** (`debt-payoff-calculator`) — Tier: Medium
- Primary: `debt payoff calculator`
- Secondary: `debt snowball calculator`, `debt avalanche calculator`, `debt free calculator`
- FAQs: What's the difference between the snowball and avalanche method? Which debt payoff method saves the most money? Which method keeps me most motivated?

### Real Estate Calculators

**30. Home Affordability Calculator** (`home-affordability-calculator`) — Tier: High
- Primary: `home affordability calculator`
- Secondary: `how much house can I afford calculator`, `home buying calculator`, `mortgage affordability calculator`
- FAQs: How much house can I afford based on my salary? What's the 28/36 rule? How does down payment affect affordability?

**31. Rent vs. Buy Calculator** (`rent-vs-buy-calculator`) — Tier: Medium
- Primary: `rent vs buy calculator`
- Secondary: `should I rent or buy calculator`, `renting vs buying a house calculator`, `rent vs mortgage calculator`
- FAQs: At what point does buying become cheaper than renting? What costs of homeownership are often overlooked? Does this account for opportunity cost of a down payment?

---

## 8. Calculation Formulas & Logic (merged from FORMULAS.md — full detail preserved)

Every formula below is a standard, publicly known financial formula (no proprietary or copyrighted methodology) — implement directly as pure functions: `input schema → formula → formatted output`, per the shared calculation-engine pattern in Section 2.

**Variable notation used throughout:**
- `P` = Principal / loan amount / present value
- `r` = annual interest rate (as decimal, e.g. 6% → 0.06)
- `i` = periodic interest rate = `r / n`
- `n` = number of compounding/payment periods per year
- `t` = time in years
- `N` = total number of periods = `n × t`
- `PMT` = periodic payment amount
- `FV` = future value
- `PV` = present value

### LOAN CALCULATORS

**1. Mortgage Calculator** — standard amortizing loan payment formula:
```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
`i` = monthly interest rate (`annual rate / 12`), `N` = total number of monthly payments (`years × 12`).
Total monthly payment shown to user (PITI) = `M + monthly_property_tax + monthly_home_insurance + monthly_PMI + monthly_HOA`
- `monthly_property_tax = (home_value × annual_property_tax_rate) / 12`
- `monthly_PMI` applies only if down payment < 20%; typically `0.5%–1.5%` of loan amount annually, divided by 12
- Total interest paid over loan life = `(M × N) − P`

**2. Mortgage Refinance Calculator** — same amortization formula as #1, run twice (existing loan vs. new loan), plus:
```
Monthly Savings = Current Monthly Payment − New Monthly Payment
Break-even Point (months) = Total Refinance Closing Costs / Monthly Savings
```
Total interest comparison = sum remaining interest on old loan (from current point forward) vs. total interest on new loan.

**3. Auto Loan Calculator** — same amortizing formula as mortgage:
```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
`P` = vehicle price − down payment − trade-in value (+ sales tax and fees if financed), `i` = monthly rate, `N` = loan term in months (typically 36–72).

**4. Personal Loan Calculator** — identical amortization formula as #1/#3:
```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
If an origination fee is charged, show both the "amount financed" and effective APR:
```
Effective APR ≈ solve for rate such that PV of (M × N) payments = (P − origination_fee)
```

**5. Student Loan Calculator** — same core amortization formula, plus:
- **Standard 10-year plan:** `N = 120` months, formula as above.
- **Income-Driven Repayment (simplified):** `PMT = (Discretionary Income × payment_percentage) / 12`, where `Discretionary Income = AGI − (poverty_line_multiplier × federal_poverty_line)`. (Flag as a simplified estimate; exact IDR formulas vary by plan (SAVE, PAYE, IBR) — link to studentaid.gov for authoritative numbers.)
- **Capitalized interest note:** if payments are deferred, unpaid interest may be added to principal — `New Principal = P + (accrued unpaid interest)`.

**6. Amortization Calculator** — generates a full schedule from the standard payment formula (#1), then for each period `k = 1...N`:
```
Interest_k = Remaining_Balance_(k−1) × i
Principal_k = M − Interest_k
Remaining_Balance_k = Remaining_Balance_(k−1) − Principal_k
```
Output: table of period, payment, principal portion, interest portion, remaining balance.

**7. Loan Payoff Calculator (extra payments)** — iterative month-by-month simulation using the amortization logic above, but each period:
```
Remaining_Balance_k = Remaining_Balance_(k−1) − Principal_k − Extra_Payment
```
Stop when `Remaining_Balance ≤ 0`. Output: new payoff date (months) vs. original term, and total interest saved:
```
Interest Saved = Original_Total_Interest − New_Total_Interest
```

**8. Debt-to-Income Ratio Calculator:**
```
DTI (%) = (Total Monthly Debt Payments / Gross Monthly Income) × 100
```
- **Front-end DTI** = (Housing payment only / Gross monthly income) × 100
- **Back-end DTI** = (All monthly debt payments including housing / Gross monthly income) × 100
Typical lender thresholds for context: front-end ≤ 28%, back-end ≤ 36–43% (varies by loan type).

### INVESTMENT & SAVINGS CALCULATORS

**9. Compound Interest Calculator:**
```
FV = P × (1 + r/n)^(n×t)
```
With regular contributions added (future value of an annuity, added to lump sum growth):
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
`n` = compounding frequency (1 = annually, 12 = monthly, 365 = daily).

**10. Simple Interest Calculator:**
```
Interest = P × r × t
Total = P + Interest
```

**11. CD Calculator** — same compound interest formula as #9 (typically daily/monthly compounding, no additional contributions after initial deposit, early-withdrawal penalty if cashed out before maturity):
```
FV = P × (1 + r/n)^(n×t)
```
Early withdrawal penalty (if modeled): typically `X months of interest`, subtract from `FV`.

**12. Investment Growth Calculator** — same as #9 (lump sum + optional recurring contribution):
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
Optional inflation-adjusted toggle:
```
Real FV = FV / (1 + inflation_rate)^t
```

**13. Dollar-Cost Averaging Calculator** — simulates period-by-period investment where each contribution grows for the remaining time; mathematically the future value of an ordinary annuity (closed form, same as #9's annuity term):
```
FV = PMT × [ ((1 + r/n)^N − 1) / (r/n) ]
```

**14. Savings Goal Calculator** — solve the annuity formula for `PMT` given a target `FV`:
```
PMT = FV × (r/n) / [ (1 + r/n)^(n×t) − 1 ]
```
Tells the user how much to save per period to reach their goal.

### RETIREMENT CALCULATORS

**15. 401(k) Calculator** — future value of contributions (employee + employer match) growing at an assumed return, using the annuity + lump sum formula from #9:
```
FV = Current_Balance × (1 + r/n)^(n×t)  +  Total_Contribution_Per_Period × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
- `Total_Contribution_Per_Period = Employee_Contribution + Employer_Match`
- `Employer_Match` = typically `min(match_rate × employee_contribution, match_cap × salary)` — model per employer match formula input (e.g., "100% up to 3%, 50% up to next 2%")
- Apply annual IRS contribution limit cap (configurable variable, changes yearly).

**16. Roth IRA Calculator** — same future value formula as #9/#15:
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
Display difference (not a math difference): contributions after-tax, qualified withdrawals tax-free. Apply annual contribution limit and MAGI phase-out range as configurable inputs (both change yearly).

**17. Traditional IRA Calculator** — same future value formula as #16. Display difference: contributions may be tax-deductible now; withdrawals in retirement taxed as ordinary income. Optionally show:
```
After-tax withdrawal value = FV × (1 − expected_retirement_tax_rate)
```

**18. Retirement Savings Calculator** — two-part formula:
1. Accumulation phase (same as #9): `FV_at_retirement = Current_Savings × (1+r/n)^(n×t) + PMT × [((1+r/n)^(n×t) −1)/(r/n)]`
2. Withdrawal/sustainability check using the "4% rule" (or configurable safe withdrawal rate):
```
Sustainable Annual Income = FV_at_retirement × safe_withdrawal_rate   (default 4%)
Years = −ln(1 − (Balance × r) / Annual_Withdrawal) / ln(1 + r)      [if withdrawal rate < return rate → indefinite]
```

**19. Social Security Benefits Estimator** — simplified/educational estimator only (exact SSA calculation uses 35-year AIME/PIA bend-point formulas requiring full earnings history — clearly disclaim and link to ssa.gov):
```
Benefit_at_claim_age = Full_Retirement_Age_Benefit × adjustment_factor
```
- Claiming before Full Retirement Age (FRA): reduces benefit ~5/9 of 1% per month for the first 36 months early, ~5/12 of 1% per month beyond that.
- Claiming after FRA (up to age 70): increases benefit ~2/3 of 1% per month (8%/year) of delayed retirement credit.

### SALARY & TAX CALCULATORS

**20. Paycheck / Take-Home Pay Calculator:**
```
Gross Pay (per period) = Annual Salary / pay_periods_per_year
Federal Income Tax Withheld = apply progressive federal bracket formula (see #23) pro-rated per period
FICA — Social Security = Gross Pay × 6.2%   (up to annual wage base cap, configurable/updated yearly)
FICA — Medicare = Gross Pay × 1.45%   (+ 0.9% Additional Medicare Tax on wages above threshold, configurable)
State Income Tax = Gross Pay × state_rate (varies by state; several states = 0%)
Net Pay = Gross Pay − Federal Tax − FICA (SS + Medicare) − State Tax − Other Deductions (401k, health insurance, etc.)
```

**21. Salary Calculator** — simple period conversions:
```
Annual = Hourly × Hours_per_week × Weeks_per_year   (typically 52, or 50 if 2 weeks unpaid vacation)
Monthly = Annual / 12
Biweekly = Annual / 26
Weekly = Annual / 52
Daily = Annual / (Weeks_per_year × Days_per_week)
```

**22. Hourly to Salary Calculator** — inverse of #21:
```
Hourly Rate = Annual Salary / (Hours_per_week × Weeks_per_year)
```
With overtime toggle (if hours > 40/week):
```
Overtime Rate = Hourly Rate × 1.5
Weekly Pay = (40 × Hourly Rate) + (Overtime Hours × Overtime Rate)
```

**23. Federal Income Tax Calculator** — progressive marginal bracket formula:
```
Tax Owed = Σ [ (min(Income, bracket_upper) − bracket_lower) × bracket_rate ]   for each bracket the income falls into
Taxable Income = Gross Income − Standard_Deduction (or Itemized_Deductions)
Effective Tax Rate = Total Tax Owed / Gross Income
Marginal Tax Rate = rate of the bracket the last dollar of income falls into
```
**Critical:** tax brackets, standard deduction amounts, and filing-status thresholds change every year (inflation-adjusted) — store as a versioned config object (`taxBrackets2026.json` etc.), never hardcode inline, and display "Tax year: [XXXX]" on the page.

### GENERAL FINANCE CALCULATORS

**24. Net Worth Calculator:**
```
Net Worth = Total Assets − Total Liabilities
```
Assets: cash, investments, retirement accounts, real estate value, vehicle value, other property.
Liabilities: mortgage balance, auto loans, student loans, credit card balances, personal loans, other debt.

**25. Inflation Calculator** — using CPI (Consumer Price Index) ratio:
```
Future Value = Present Value × (CPI_end / CPI_start)
```
Or with an assumed constant inflation rate:
```
Future Value = Present Value × (1 + inflation_rate)^t
Equivalent Past Value = Present Value / (1 + inflation_rate)^t
```

**26. ROI Calculator:**
```
ROI (%) = [ (Final Value − Initial Investment) / Initial Investment ] × 100
```
Annualized ROI (CAGR), for multi-year holdings:
```
Annualized ROI (%) = [ (Final Value / Initial Investment)^(1/t) − 1 ] × 100
```

**27. Break-Even Point Calculator:**
```
Break-even Point (units) = Fixed Costs / (Price per Unit − Variable Cost per Unit)
Break-even Point (revenue $) = Break-even Units × Price per Unit
Contribution Margin per Unit = Price per Unit − Variable Cost per Unit
Contribution Margin Ratio = Contribution Margin per Unit / Price per Unit
```

**28. Credit Card Payoff Calculator** — iterative month-by-month simulation (credit cards typically compound daily but billed monthly — use monthly periodic rate as an approximation):
```
i = APR / 12
Interest_month = Remaining_Balance × i
Principal_paid_month = Payment − Interest_month
Remaining_Balance_new = Remaining_Balance − Principal_paid_month
```
Repeat until `Remaining_Balance ≤ 0`. If "minimum payment only" selected, recompute minimum payment each month:
```
Minimum Payment = max( Remaining_Balance × min_payment_percentage (e.g. 1–3%), flat_minimum_dollar_amount (e.g. $25) )
```
Output: months to payoff, total interest paid, and a comparison scenario at a higher fixed payment.

**29. Debt Payoff Calculator (Snowball / Avalanche)** — given a list of debts `[{balance, APR, minimum_payment}, ...]` and an extra monthly amount `E`:
- **Avalanche:** sort debts by `APR` descending. Apply minimums to all debts; apply all extra `E` to the highest-APR debt until paid off, then roll its full payment onto the next-highest-APR debt, and so on.
- **Snowball:** identical mechanics, but sort by `balance` ascending (smallest first) instead of APR.
Run the same iterative payoff simulation as #28 across all debts simultaneously, tracking:
```
Total Months to Debt-Free
Total Interest Paid (sum across all debts)
```
Display both methods side by side (avalanche always ≤ snowball in total interest, mathematically; snowball clears individual debts faster psychologically).

### REAL ESTATE CALCULATORS

**30. Home Affordability Calculator** — standard mortgage-lending "28/36 rule":
```
Max Housing Payment (front-end) = Gross Monthly Income × 0.28
Max Total Debt Payment (back-end) = Gross Monthly Income × 0.36
Max Housing Payment = min(front-end limit, back-end limit − other monthly debts)
```
Solve the amortization formula (#1) in reverse for `P` (max loan amount) given `M` = Max Housing Payment (minus estimated taxes/insurance/PMI):
```
P = M × [ (1+i)^N − 1 ] / [ i(1+i)^N ]
Max Home Price = P + Down Payment
```

**31. Rent vs. Buy Calculator** — compares total cost of renting vs. buying over a holding period `t`:

*Cost of Renting:*
```
Total Rent Cost = Σ (Monthly Rent × (1 + annual_rent_increase)^year)  for each year, summed over t years
Opportunity Cost of Down Payment = Down Payment × (1 + investment_return_rate)^t − Down Payment
```

*Cost of Buying:*
```
Total Buying Cost = Down Payment + Total Mortgage Payments (principal + interest, via amortization formula #1)
                   + Property Taxes (over t years) + Home Insurance (over t years)
                   + Maintenance (typically 1%/year of home value) + Closing Costs
                   − Home Equity Built (principal paid down)
                   − Home Appreciation (Home_Value × (1+appreciation_rate)^t − Home_Value)
                   − Net Proceeds if Sold (Sale Price − Remaining Mortgage Balance − Selling Costs, typically 6–8% of sale price)
```
Output: net cost of each path over `t` years, and the "break-even" year where buying becomes cheaper than renting.

### Formula Implementation Notes

1. **All rate inputs** should be collected from the user as a percentage (e.g., "6.5") and converted to decimal (`/100`) once, at the top of each calculation function — keep this conversion consistent to avoid off-by-100 bugs.
2. **Rounding:** round only at final display, not between intermediate calculation steps, to avoid compounding rounding errors in amortization schedules.
3. **Edge cases to handle in every loan/amortization formula:** `i = 0` (0% interest — the standard formula divides by zero; fall back to `M = P / N`), negative amortization inputs, `N ≤ 0`.
4. **Configurable, versioned constants** (must NOT be hardcoded inline in formula logic — store in a dated config file under `src/data/`, reference by tax-year/plan-year): federal tax brackets, standard deduction, 401(k)/IRA contribution limits, Social Security wage base, FICA rates, IRS mileage rates if ever added. Review and update every January for the new tax year, and display "Tax year: [XXXX]" or "Contribution limits: [XXXX]" on the relevant pages.
5. **Cross-reference Section 6, item 7** — every formula above must ship with the "How is this calculated" on-page explanation using this same formula, in plain language.

---

## 9. Technical SEO & Full Indexing Checklist (mandatory — zero pages should be excluded)

1. **Sitemap:** use `@astrojs/sitemap` integration — auto-generates `sitemap-index.xml` covering all 31 tool pages + 6 category pages + homepage + static pages + blog posts on every build. Regenerate automatically; no manual maintenance.
2. **robots.txt:** static file in `public/robots.txt`, allow all crawlers, explicitly reference the sitemap URL. Do not disallow `/calculators/`.
3. **Google Search Console:**
   - Verify domain property (DNS TXT record method — covers all subdomains/protocols).
   - Submit sitemap.
   - Use URL Inspection → "Request Indexing" manually for all 31 tool pages + 6 category pages at launch (don't wait for organic crawl).
   - Monitor Coverage report weekly for "Discovered – not indexed" or "Crawled – not indexed" pages and fix (usually thin content or missing internal links).
4. **Bing Webmaster Tools:**
   - Import verified site directly from Google Search Console (one-click).
   - Submit sitemap separately.
   - Enable **IndexNow** (Bing + Yandex) — Cloudflare Pages Functions make it easy to fire an IndexNow ping automatically on deploy (hook into the Cloudflare Pages build webhook) so pages are pushed instantly instead of waiting for a crawl.
5. **No orphan pages:** every page must be reachable via the mega menu, footer sitemap block, or "related calculators" internal links. Run a crawl (Screaming Frog or Sitebulb) before launch to confirm 0 orphan pages and 0 broken internal links.
6. **Canonical tags:** self-referencing on every page via Astro's `<head>` partial, no conflicting canonicals.
7. **Pagination/parameters:** if any calculator uses query params for pre-filled values, canonicalize to the clean URL to avoid duplicate content.
8. **Mobile-first:** test every calculator's touch usability (number inputs, sliders) — Google indexes the mobile version primarily.
9. **Core Web Vitals:** Astro's near-zero default JS makes this easy to hit — target LCP < 2.5s, INP < 200ms, CLS < 0.1. Avoid layout shift from ads loading above the calculator; reserve ad slot space up front.
10. **HTTPS + www/non-www consistency:** Cloudflare Pages handles HTTPS automatically; pick one canonical domain format and set the redirect via Cloudflare's dashboard (Page Rules or Bulk Redirects).
11. **404 handling:** custom `404.astro` page that links back to the calculators directory (avoid dead ends).
12. **Structured data testing:** validate every page's JSON-LD with Google's Rich Results Test before launch.
13. **Internal linking depth rule:** every calculator page must be reachable in 3 clicks or fewer from the homepage (mega menu = 1 click; footer = 1 click either way).

---

## 10. Internal Linking / SEO Authority Strategy

- **Homepage** links to all 6 category hubs + top 8–10 highest-tier tools directly ("Most Popular Calculators" section).
- **Category hub pages** link to every tool within that category, plus a short 150–200 word intro paragraph targeting the category keyword (e.g. `/calculators/loan/` targets "loan calculators").
- **Every tool page** links to 4–6 related tools in its "Related Calculators" block, prioritizing same-category tools first, then cross-category tools that share user intent (e.g., Mortgage Calculator → Home Affordability Calculator → Rent vs Buy Calculator → Amortization Calculator).
- **Blog posts** (optional but recommended) target informational long-tail keywords (e.g. "how much house can I afford on $70k salary") and link into the relevant calculator — this is how you capture featured snippets and build topical authority without competing directly with Bankrate/NerdWallet on the head term.
- **Footer sitemap block:** flat list of all 31 tools, always present site-wide — the single highest-leverage internal linking element on the site.

---

## 11. Content & E-E-A-T Requirements

- Every calculator page needs genuinely useful written content (300–600 words minimum), not just a widget — thin-content calculator pages get filtered by Google's Helpful Content system.
- Show the actual math/formula used (Section 8) — builds trust and differentiates from black-box competitors.
- Add an "About the data" or "Last updated" note (tax brackets, contribution limits, and interest rate assumptions change yearly — update dates matter for finance YMYL content).
- Include a visible disclaimer: not financial, tax, or legal advice.
- Consider a "Reviewed by" byline if a qualified person checks the calculator logic — finance is a YMYL (Your Money or Your Life) category, and Google weighs E-E-A-T heavily here.

---

## 12. Build Priority Order (for the agent/dev team)

1. Astro project scaffold: layout, header w/ mega menu, footer w/ sitemap block, homepage shell, Tailwind config.
2. Reusable Calculator Page Astro component (calculator island slot + schema + FAQ block + related-tools block).
3. Build the "Tier: High" tools first (Mortgage, Auto Loan, Student Loan, Amortization, Compound Interest, 401(k), Roth IRA, Retirement, Paycheck, Salary, Federal Income Tax, Credit Card Payoff, Home Affordability) — these carry the most traffic potential.
4. Category hub pages (6).
5. Remaining tools.
6. Blog/content layer.
7. Static pages (About, Contact, Privacy, Terms, Disclaimer).
8. Full technical SEO pass (Section 9) before requesting indexing.
9. Submit to GSC + Bing, request indexing, set up the IndexNow deploy hook, monitor Coverage report weekly for the first 2 months.

---

## 13. Notes for the Building Agent

- Do not hardcode 2025/2026 tax brackets, contribution limits, or interest rate defaults without a clearly visible "last updated" date — these change annually (401k/IRA limits, standard deduction, tax brackets) and stale numbers erode trust and rankings.
- Keep every calculator 100% client-side (no PII sent to a server) — this is both a UX/speed win and a trust/privacy selling point worth mentioning on the page. No Cloudflare Pages Function is needed anywhere in this project since there is no live-data tool in this 31-tool set.
- Reuse one shared calculation-engine pattern (input schema → formula function → formatted output) across all 31 tools so new calculators can be added quickly without duplicating boilerplate.
- All formulas live in Section 8 of this file now — there is no separate FORMULAS.md to keep in sync; if this project's tool list changes, update Sections 5, 7, and 8 together so the tool table, keyword/FAQ list, and formula list never drift out of sync with each other.

(End of file)

<!-- better-design:start -->
Compose the installed components/ui/* primitives; never hand-roll a <button>/<table>/<input>/<dialog> or fake a ⌘K palette / menu / notification bell. Use only app/globals.css design tokens. See .better-design/rules.md.
<!-- better-design:end -->