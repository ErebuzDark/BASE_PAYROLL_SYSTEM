import { useState } from 'react'
import { Settings2, Plus, Trash2, X, Save, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  useDeductionTypes, useCreateDeductionType, useDeleteDeductionType,
  useAllowanceTypes, useCreateAllowanceType, useDeleteAllowanceType,
  useCompanySettings, useUpdateCompanySettings,
} from '@/features/settings/hooks/useSettings'

const CATEGORY_COLORS = {
  Government: 'badge-info',
  Tax: 'badge-warning',
  Loan: 'badge-neutral',
  Penalty: 'badge-destructive',
}

function DeductionModal({ onClose }) {
  const [form, setForm] = useState({ name: '', type: 'Government', description: '' })
  const createDed = useCreateDeductionType()

  function handleSubmit(e) {
    e.preventDefault()
    createDed.mutate(form, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold">Add Deduction Type</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Name</label>
              <input className="form-input" required placeholder="e.g. SSS Loan"
                value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Government</option>
                <option>Tax</option>
                <option>Loan</option>
                <option>Penalty</option>
              </select>
            </div>
            <div>
              <label className="form-label">Description</label>
              <input className="form-input" placeholder="Short description"
                value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={createDed.isPending}>
              {createDed.isPending ? 'Adding...' : 'Add Deduction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AllowanceModal({ onClose }) {
  const [form, setForm] = useState({ name: '', taxable: false })
  const createAll = useCreateAllowanceType()

  function handleSubmit(e) {
    e.preventDefault()
    createAll.mutate(form, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold">Add Allowance Type</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Name</label>
              <input className="form-input" required placeholder="e.g. Internet Allowance"
                value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="taxable-flag" className="w-4 h-4 rounded"
                checked={form.taxable} onChange={(e) => setForm(f => ({ ...f, taxable: e.target.checked }))} />
              <label htmlFor="taxable-flag" className="form-label mb-0 cursor-pointer">Taxable</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={createAll.isPending}>
              {createAll.isPending ? 'Adding...' : 'Add Allowance'}
            </button>
          </div>
        </form>
      </div>
    </div>
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

  function startEditCompany() {
    setCompanyForm({ ...companySettings })
  }

  function handleSaveCompany(e) {
    e.preventDefault()
    updateCompany.mutate(companyForm, {
      onSuccess: () => setCompanyForm(null),
    })
  }

  function handleDeleteDed(d) {
    if (window.confirm(`Delete deduction type "${d.name}"?`)) {
      deleteDed.mutate(d.id)
    }
  }

  function handleDeleteAll(a) {
    if (window.confirm(`Delete allowance type "${a.name}"?`)) {
      deleteAll.mutate(a.id)
    }
  }

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
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <Settings2 size={16} style={{ color: 'var(--color-primary)' }} />
              <p className="text-sm font-semibold">Deduction Types</p>
            </div>
            <button className="btn btn-outline text-xs px-3 py-1.5 gap-1" onClick={() => setShowDedModal(true)}>
              <Plus size={13} /> Add
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dedLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j}><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: 80 }} /></td>
                    ))}
                  </tr>
                ))
              ) : deductionTypes.map((d) => (
                <tr key={d.id}>
                  <td className="font-medium text-sm">{d.name}</td>
                  <td>
                    <span className={`badge ${CATEGORY_COLORS[d.type] ?? 'badge-neutral'}`}>{d.type}</span>
                  </td>
                  <td className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{d.description}</td>
                  <td>
                    <button
                      className="btn btn-ghost p-1.5"
                      style={{ color: 'var(--color-destructive)' }}
                      onClick={() => handleDeleteDed(d)}
                      disabled={deleteDed.isPending}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Allowance Types */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <Settings2 size={16} style={{ color: 'var(--color-success)' }} />
              <p className="text-sm font-semibold">Allowance Types</p>
            </div>
            <button className="btn btn-outline text-xs px-3 py-1.5 gap-1" onClick={() => setShowAllModal(true)}>
              <Plus size={13} /> Add
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Taxable</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(3)].map((_, j) => (
                      <td key={j}><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: 80 }} /></td>
                    ))}
                  </tr>
                ))
              ) : allowanceTypes.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium text-sm">{a.name}</td>
                  <td>
                    <span className={`badge ${a.taxable ? 'badge-warning' : 'badge-success'}`}>
                      {a.taxable ? 'Taxable' : 'Non-taxable'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost p-1.5"
                      style={{ color: 'var(--color-destructive)' }}
                      onClick={() => handleDeleteAll(a)}
                      disabled={deleteAll.isPending}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Company Settings */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Company & Payroll Settings</p>
            {!isEditingCompany ? (
              <button className="btn btn-outline text-xs px-3 py-1.5 gap-1" onClick={startEditCompany} disabled={!companySettings}>
                <Settings2 size={13} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-outline text-xs px-3 py-1.5" onClick={() => setCompanyForm(null)}>Cancel</button>
                <button className="btn btn-primary text-xs px-3 py-1.5 gap-1" onClick={handleSaveCompany} disabled={updateCompany.isPending}>
                  <Save size={13} /> {updateCompany.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          {updateCompany.isSuccess && !isEditingCompany && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs font-medium"
              style={{ background: 'var(--color-success)' + '18', color: 'var(--color-success)' }}>
              <CheckCircle2 size={14} /> Settings saved successfully
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {companyFields.map(({ label, key, type, step }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                {isEditingCompany ? (
                  <input
                    className="form-input"
                    type={type}
                    step={step}
                    value={companyForm[key]}
                    onChange={(e) => setCompanyForm(f => ({
                      ...f,
                      [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                    }))}
                  />
                ) : (
                  <input className="form-input" defaultValue={companySettings?.[key] ?? ''}
                    readOnly style={{ background: 'var(--color-neutral-100)', cursor: 'default' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDedModal && <DeductionModal onClose={() => setShowDedModal(false)} />}
      {showAllModal && <AllowanceModal onClose={() => setShowAllModal(false)} />}
    </div>
  )
}
