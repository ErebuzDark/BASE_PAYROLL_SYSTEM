import { cn } from '@/lib/utils'

export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="page-header mb-0">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
