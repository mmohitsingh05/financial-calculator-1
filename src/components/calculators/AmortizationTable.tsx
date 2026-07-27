import type { AmortizationRow } from '@/lib/CalculatorEngine'
import { formatCurrency } from '@/lib/CalculatorEngine'

interface AmortizationTableProps {
  schedule: AmortizationRow[]
  maxRows?: number
}

export function AmortizationTable({ schedule, maxRows = 10 }: AmortizationTableProps) {
  const display = maxRows ? schedule.slice(0, maxRows) : schedule

  return (
    <div class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-muted">
            <th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Period</th>
            <th class="px-3 py-2 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Payment</th>
            <th class="px-3 py-2 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Principal</th>
            <th class="px-3 py-2 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Interest</th>
            <th class="px-3 py-2 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {display.map(row => (
            <tr key={row.period} class="hover:bg-muted/50">
              <td class="px-3 py-2 text-foreground">{row.period}</td>
              <td class="px-3 py-2 text-right text-foreground">{formatCurrency(row.payment)}</td>
              <td class="px-3 py-2 text-right text-foreground">{formatCurrency(row.principal)}</td>
              <td class="px-3 py-2 text-right text-foreground">{formatCurrency(row.interest)}</td>
              <td class="px-3 py-2 text-right text-foreground">{formatCurrency(row.remainingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {maxRows && schedule.length > maxRows && (
        <p class="p-3 text-center text-xs text-muted-foreground border-t border-border">
          Showing first {maxRows} of {schedule.length} periods
        </p>
      )}
    </div>
  )
}