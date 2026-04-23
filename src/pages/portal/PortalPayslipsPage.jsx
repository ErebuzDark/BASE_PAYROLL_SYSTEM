import { useState } from 'react'
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMyPayslips } from '@/features/portal/hooks/usePortal'
import { formatCurrency } from '@/lib/utils'

function PayslipCard({ payslip }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      {/* Header - always visible */}
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-slate-100">
            <Receipt size={16} className="text-slate-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">{payslip.period}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={payslip.runStatus} />
              <span className="text-[11px] text-slate-400">{payslip.daysWorked} days worked</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Net Pay</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(payslip.netPay)}</p>
          </div>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-6 pt-4">
            {/* Earnings */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Earnings</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Basic Pay</span>
                  <span className="font-medium text-slate-700">{formatCurrency(payslip.basicPay)}</span>
                </div>
                {payslip.overtimePay > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">OT Pay ({payslip.overtimeHours}h)</span>
                    <span className="font-medium text-slate-700">{formatCurrency(payslip.overtimePay)}</span>
                  </div>
                )}
                {payslip.allowances?.map((a) => (
                  <div key={a.type} className="flex justify-between text-sm">
                    <span className="text-slate-500">{a.type}</span>
                    <span className="font-medium text-slate-700">{formatCurrency(a.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-semibold">
                  <span className="text-slate-700">Gross Pay</span>
                  <span className="text-emerald-600">{formatCurrency(payslip.grossPay)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Deductions</p>
              <div className="space-y-2">
                {payslip.deductions?.map((d) => (
                  <div key={d.type} className="flex justify-between text-sm">
                    <span className="text-slate-500">{d.type}</span>
                    <span className="font-medium text-slate-700">({formatCurrency(d.amount)})</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-semibold">
                  <span className="text-slate-700">Total Deductions</span>
                  <span className="text-red-600">({formatCurrency(payslip.totalDeductions)})</span>
                </div>
              </div>
            </div>

            {/* Net Pay Summary */}
            <div className="flex flex-col justify-end">
              <div className="rounded-lg p-5 text-center bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Net Pay</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">{formatCurrency(payslip.netPay)}</p>
                <p className="text-[11px] text-slate-400 mt-1">{payslip.daysWorked} days · {payslip.hoursRegular}h regular</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function PortalPayslipsPage() {
  const { data: payslips = [], isLoading } = useMyPayslips()

  return (
    <div>
      <PageHeader title="My Payslips" subtitle="View your payslip history and earnings breakdown" />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-16 rounded bg-slate-100 animate-pulse" /></CardContent></Card>
          ))}
        </div>
      ) : payslips.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">No payslips available yet.</p>
            <p className="text-xs text-slate-400 mt-1">Payslips will appear after payroll runs are processed and released.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payslips.map((ps) => (
            <PayslipCard key={ps.id} payslip={ps} />
          ))}
        </div>
      )}
    </div>
  )
}
