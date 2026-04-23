import { useState } from 'react'
import { Clock } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useMyAttendance } from '@/features/portal/hooks/usePortal'
import { formatDate } from '@/lib/utils'

export default function PortalAttendancePage() {
  const [dateFilter, setDateFilter] = useState('')
  const { data: attendance = [], isLoading } = useMyAttendance(dateFilter ? { date: dateFilter } : {})

  const present = attendance.filter(a => a.status === 'Present').length
  const late = attendance.filter(a => a.status === 'Late').length
  const absent = attendance.filter(a => a.status === 'Absent').length
  const onLeave = attendance.filter(a => a.status === 'On Leave').length

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="View your attendance records" />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Present', count: present, color: 'text-emerald-600' },
          { label: 'Late', count: late, color: 'text-amber-600' },
          { label: 'Absent', count: absent, color: 'text-red-600' },
          { label: 'On Leave', count: onLeave, color: 'text-blue-600' },
        ].map(({ label, count, color }) => (
          <Card key={label}>
            <CardContent className="p-5 text-center">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs mt-1 text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4 items-end">
        <div className="space-y-1.5">
          <Label>Filter by Date</Label>
          <Input className="w-44" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>
        {dateFilter && <Button variant="outline" size="sm" onClick={() => setDateFilter('')}>Clear</Button>}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>{[...Array(5)].map((_, j) => (
                  <TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>
                ))}</TableRow>
              ))
            ) : attendance.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-30" />
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((att) => (
                <TableRow key={att.id}>
                  <TableCell className="font-medium text-slate-800">{formatDate(att.date)}</TableCell>
                  <TableCell>{att.timeIn ?? <span className="text-slate-400">—</span>}</TableCell>
                  <TableCell>{att.timeOut ?? <span className="text-slate-400">—</span>}</TableCell>
                  <TableCell>{att.hoursWorked > 0 ? `${att.hoursWorked}h` : <span className="text-slate-400">—</span>}</TableCell>
                  <TableCell><StatusBadge status={att.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
