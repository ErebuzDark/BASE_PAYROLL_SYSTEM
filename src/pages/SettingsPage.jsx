import { useState } from 'react'
import { Settings2, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  useDeductionTypes, useCreateDeductionType, useDeleteDeductionType,
  useAllowanceTypes, useCreateAllowanceType, useDeleteAllowanceType,
  useCompanySettings, useUpdateCompanySettings,
} from '@/features/settings/hooks/useSettings'

const CATEGORY_VARIANTS = { Government: 'info', Tax: 'warning', Loan: 'secondary', Penalty: 'destructive' }

function DeductionModal({ onClose }) {
  const [form, setForm] = useState({ name: '', type: 'Government', description: '' })
  const createDed = useCreateDeductionType()
  function handleSubmit(e) { e.preventDefault(); createDed.mutate(form, { onSuccess: onClose }) }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Deduction Type</DialogTitle><DialogDescription className="sr-only">Add a new deduction type</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input required placeholder="e.g. SSS Loan" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Category</Label>
              <NativeSelect value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Government</option><option>Tax</option><option>Loan</option><option>Penalty</option>
              </NativeSelect>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Input placeholder="Short description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createDed.isPending}>{createDed.isPending ? 'Adding...' : 'Add Deduction'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AllowanceModal({ onClose }) {
  const [form, setForm] = useState({ name: '', taxable: false })
  const createAll = useCreateAllowanceType()
  function handleSubmit(e) { e.preventDefault(); createAll.mutate(form, { onSuccess: onClose }) }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Allowance Type</DialogTitle><DialogDescription className="sr-only">Add a new allowance type</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input required placeholder="e.g. Internet Allowance" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="taxable-flag" className="w-4 h-4 rounded accent-slate-800" checked={form.taxable} onChange={(e) => setForm(f => ({ ...f, taxable: e.target.checked }))} />
              <label htmlFor="taxable-flag" className="text-sm font-medium text-slate-700 cursor-pointer">Taxable</label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createAll.isPending}>{createAll.isPending ? 'Adding...' : 'Add Allowance'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function SettingsPage() {
  const [showDedModal, setShowDedModal] = useState(false)
  const [showAllModal, setShowAllModal] = useState(false)
  const { data: deductionTypes = [], isLoading: dedLoading } = useDeductionTypes()
  const { data: allowanceTypes = [], isLoading: allLoading } = useAllowanceTypes()
  const { data: companySettings } = useCompanySettings()
  const deleteDed = useDeleteDeductionType()
  const deleteAll = useDeleteAllowanceType()
  const updateCompany = useUpdateCompanySettings()
  const [companyForm, setCompanyForm] = useState(null)
  const isEditingCompany = companyForm !== null

  function startEditCompany() { setCompanyForm({ ...companySettings }) }
  function handleSaveCompany(e) { e.preventDefault(); updateCompany.mutate(companyForm, { onSuccess: () => setCompanyForm(null) }) }
  function handleDeleteDed(d) { if (window.confirm(`Delete deduction type "${d.name}"?`)) deleteDed.mutate(d.id) }
  function handleDeleteAll(a) { if (window.confirm(`Delete allowance type "${a.name}"?`)) deleteAll.mutate(a.id) }

  const companyFields = [
    { label: 'Company Name', key: 'companyName', type: 'text' },
    { label: 'Payroll Currency', key: 'currency', type: 'text' },
    { label: 'Pay Schedule', key: 'paySchedule', type: 'text' },
    { label: 'Work Days / Week', key: 'workDaysPerWeek', type: 'number' },
    { label: 'Work Hours / Day', key: 'workHoursPerDay', type: 'number' },
    { label: 'OT Rate Multiplier', key: 'otRateMultiplier', type: 'number', step: '0.05' },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage system configuration and payroll parameters" />

      <div className="grid grid-cols-2 gap-6">
        {/* Deduction Types */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2"><Settings2 size={16} className="text-slate-700" /><p className="text-sm font-semibold text-slate-900">Deduction Types</p></div>
            <Button variant="outline" size="sm" onClick={() => setShowDedModal(true)}><Plus size={13} /> Add</Button>
          </div>
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {dedLoading ? [...Array(4)].map((_, i) => (<TableRow key={i}>{[...Array(4)].map((_, j) => (<TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>))}</TableRow>))
              : deductionTypes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium text-sm text-slate-800">{d.name}</TableCell>
                  <TableCell><Badge variant={CATEGORY_VARIANTS[d.type] ?? 'secondary'}>{d.type}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-500">{d.description}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteDed(d)} disabled={deleteDed.isPending} title="Delete"><Trash2 size={13} /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Allowance Types */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2"><Settings2 size={16} className="text-emerald-600" /><p className="text-sm font-semibold text-slate-900">Allowance Types</p></div>
            <Button variant="outline" size="sm" onClick={() => setShowAllModal(true)}><Plus size={13} /> Add</Button>
          </div>
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Name</TableHead><TableHead>Taxable</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {allLoading ? [...Array(4)].map((_, i) => (<TableRow key={i}>{[...Array(3)].map((_, j) => (<TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>))}</TableRow>))
              : allowanceTypes.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-sm text-slate-800">{a.name}</TableCell>
                  <TableCell><Badge variant={a.taxable ? 'warning' : 'success'}>{a.taxable ? 'Taxable' : 'Non-taxable'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteAll(a)} disabled={deleteAll.isPending} title="Delete"><Trash2 size={13} /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Company Settings */}
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-900">Company & Payroll Settings</p>
            {!isEditingCompany ? (
              <Button variant="outline" size="sm" onClick={startEditCompany} disabled={!companySettings}><Settings2 size={13} /> Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCompanyForm(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveCompany} disabled={updateCompany.isPending}><Save size={13} /> {updateCompany.isPending ? 'Saving...' : 'Save'}</Button>
              </div>
            )}
          </div>
          {updateCompany.isSuccess && !isEditingCompany && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={14} /> Settings saved successfully
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {companyFields.map(({ label, key, type, step }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                {isEditingCompany ? (
                  <Input type={type} step={step} value={companyForm[key]}
                    onChange={(e) => setCompanyForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))} />
                ) : (
                  <Input defaultValue={companySettings?.[key] ?? ''} readOnly className="bg-slate-50 cursor-default" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showDedModal && <DeductionModal onClose={() => setShowDedModal(false)} />}
      {showAllModal && <AllowanceModal onClose={() => setShowAllModal(false)} />}
    </div>
  )
}
