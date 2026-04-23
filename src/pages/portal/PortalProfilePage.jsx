import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useAuth } from '@/context/AuthContext'
import { useMyProfile } from '@/features/portal/hooks/usePortal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Mail, Phone, Briefcase, Calendar, Building2, CreditCard, ShieldCheck } from 'lucide-react'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="p-2 rounded-lg bg-slate-50 shrink-0">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function PortalProfilePage() {
  const { employee } = useAuth()
  const { data: profile, isLoading } = useMyProfile()

  const emp = profile || employee

  if (isLoading || !emp) {
    return (
      <div>
        <PageHeader title="My Profile" subtitle="View your personal and employment information" />
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-40 rounded bg-slate-100 animate-pulse" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Profile" subtitle="View your personal and employment information" />

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-slate-800 text-white text-xl">
                {emp.firstName[0]}{emp.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{emp.firstName} {emp.lastName}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{emp.position} · {emp.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={emp.status} />
                <Badge variant="secondary">{emp.id}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Personal Information</p>
            <InfoRow icon={Mail} label="Email" value={emp.email} />
            <InfoRow icon={Phone} label="Phone" value={emp.phone} />
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Employment Details</p>
            <InfoRow icon={Briefcase} label="Position" value={emp.position} />
            <InfoRow icon={Building2} label="Department" value={emp.department} />
            <InfoRow icon={Calendar} label="Hire Date" value={formatDate(emp.hireDate)} />
            <InfoRow icon={CreditCard} label="Basic Salary" value={formatCurrency(emp.basicSalary)} />
            <div className="flex items-start gap-3 py-3">
              <div className="p-2 rounded-lg bg-slate-50 shrink-0">
                <ShieldCheck size={14} className="text-slate-500" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Employment Type</p>
                <div className="mt-1"><StatusBadge status={emp.employmentType} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Government IDs & Banking */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Government IDs & Banking</p>
            {[
              { label: 'SSS Number', value: emp.sssNumber },
              { label: 'PhilHealth', value: emp.philhealthNumber },
              { label: 'Pag-IBIG', value: emp.pagibigNumber },
              { label: 'TIN', value: emp.tinNumber },
              { label: 'Bank Account', value: emp.bankAccount },
            ].map(({ label, value }) => (
              <div key={label} className="py-2.5 border-b border-slate-50 last:border-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5 font-mono">{value || '—'}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
