import { Badge } from '@/components/ui/badge'

const STATUS_MAP = {
  // Employee
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'secondary',
  Terminated: 'destructive',
  Probationary: 'info',

  // Payroll
  Draft: 'secondary',
  Processed: 'info',
  Released: 'success',
  Cancelled: 'destructive',

  // Attendance
  Present: 'success',
  Absent: 'destructive',
  Late: 'warning',
  Holiday: 'info',

  // Leave
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'destructive',

  // Employment type
  Regular: 'success',
}

export function StatusBadge({ status, className }) {
  const variant = STATUS_MAP[status] ?? 'secondary'
  return <Badge variant={variant} className={className}>{status}</Badge>
}
