import * as React from 'react'
import { cn } from '@/lib/utils'

const NativeSelect = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer bg-[url("data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%2364748b%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e")] bg-[position:right_0.35rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-8',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
NativeSelect.displayName = 'NativeSelect'

export { NativeSelect }
