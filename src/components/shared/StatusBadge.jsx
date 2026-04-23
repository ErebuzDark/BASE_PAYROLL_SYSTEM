import { cn } from '@/lib/utils'

const STATUS_MAP = {
  // Employee
  Active: 'badge-success',
  'On Leave': 'badge-warning',
  Inactive: 'badge-neutral',
  Terminated: 'badge-destructive',
  Probationary: 'badge-info',

  // Payroll
  Draft: 'badge-neutral',
  Processed: 'badge-info',
  Released: 'badge-success',
  Cancelled: 'badge-destructive',

  // Attendance
  Present: 'badge-success',
  Absent: 'badge-destructive',
  Late: 'badge-warning',
  'On Leave': 'badge-warning',
  Holiday: 'badge-info',

  // Leave
  Approved: 'badge-success',
  Pending: 'badge-warning',
  Rejected: 'badge-destructive',

  // Employment type
  Regular: 'badge-success',
}

export function StatusBadge({ status, className }) {
  const variant = STATUS_MAP[status] ?? 'badge-neutral'
  return <span className={cn('badge', variant, className)}>{status}</span>
}
