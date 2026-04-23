import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-800 text-white',
        secondary: 'bg-slate-100 text-slate-600',
        success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
        warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
        destructive: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
        info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
        outline: 'border border-slate-200 text-slate-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
