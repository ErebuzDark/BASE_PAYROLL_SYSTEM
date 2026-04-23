import { useState } from 'react'
import { Search, Plus, Pencil, Trash2, X, User } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useDepartments } from '@/features/employees/hooks/useEmployees'
import { formatCurrency, formatDate } from '@/lib/utils'

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '', position: '',
  department: '', employmentType: 'Regular', basicSalary: '',
  sssNumber: '', philhealthNumber: '', pagibigNumber: '', tinNumber: '', bankAccount: '',
}

function EmployeeModal({ employee, onClose, departments }) {
  const isEdit = !!employee?.id
  const [form, setForm] = useState(employee ?? EMPTY_FORM)
  const createEmp = useCreateEmployee()
  const updateEmp = useUpdateEmployee()

  const isPending = createEmp.isPending || updateEmp.isPending

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const data = { ...form, basicSalary: Number(form.basicSalary) }
    const mutation = isEdit ? updateEmp : createEmp
    mutation.mutate(isEdit ? { id: employee.id, ...data } : data, {
      onSuccess: onClose,
    })
  }

  const field = (label, name, type = 'text', opts = {}) => (
    <div>
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        required={opts.required !== false}
        {...opts}
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
          <div className="px-6 py-5 space-y-5">
            {/* Personal Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-neutral-500)' }}>
                Personal Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                {field('First Name', 'firstName')}
                {field('Last Name', 'lastName')}
                {field('Email', 'email', 'email')}
                {field('Phone', 'phone', 'tel')}
              </div>
            </div>

            {/* Employment */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-neutral-500)' }}>
                Employment Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {field('Position', 'position')}
                <div>
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleChange} required>
                    <option value="">Select department</option>
                    {departments?.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Employment Type</label>
                  <select className="form-select" name="employmentType" value={form.employmentType} onChange={handleChange}>
                    <option>Regular</option>
                    <option>Probationary</option>
                    <option>Contractual</option>
                    <option>Part-time</option>
                  </select>
                </div>
                {field('Basic Salary (₱)', 'basicSalary', 'number', { min: 0 })}
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-neutral-500)' }}>
                Government IDs & Banking
              </p>
              <div className="grid grid-cols-2 gap-4">
                {field('SSS Number', 'sssNumber', 'text', { required: false })}
                {field('PhilHealth Number', 'philhealthNumber', 'text', { required: false })}
                {field('Pag-IBIG Number', 'pagibigNumber', 'text', { required: false })}
                {field('TIN Number', 'tinNumber', 'text', { required: false })}
                <div className="col-span-2">{field('Bank Account', 'bankAccount', 'text', { required: false })}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [modalEmp, setModalEmp] = useState(null) // null=closed, {}=new, emp=edit
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: employees = [], isLoading } = useEmployees({ search, status: statusFilter, department: deptFilter })
  const { data: departments = [] } = useDepartments()
  const deleteEmp = useDeleteEmployee()

  function handleDelete(emp) {
    if (window.confirm(`Remove ${emp.firstName} ${emp.lastName}? This cannot be undone.`)) {
      deleteEmp.mutate(emp.id)
    }
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} employee${employees.length !== 1 ? 's' : ''}`}
        actions={
          <button className="btn btn-primary" onClick={() => setModalEmp({})}>
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-neutral-400)' }} />
          <input
            className="form-input pl-9"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </select>
        <select className="form-select w-44" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Department</th>
              <th>Type</th>
              <th>Basic Salary</th>
              <th>Status</th>
              <th>Hire Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j}>
                      <div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: j === 0 ? 140 : 80 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12" style={{ color: 'var(--color-neutral-400)' }}>
                  <User size={32} className="mx-auto mb-2 opacity-30" />
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'var(--color-primary)', color: 'white' }}
                      >
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-neutral-900)' }}>
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td><StatusBadge status={emp.employmentType} /></td>
                  <td className="font-medium">{formatCurrency(emp.basicSalary)}</td>
                  <td><StatusBadge status={emp.status} /></td>
                  <td>{formatDate(emp.hireDate)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-ghost p-1.5" onClick={() => setModalEmp(emp)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-ghost p-1.5"
                        style={{ color: 'var(--color-destructive)' }}
                        onClick={() => handleDelete(emp)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalEmp !== null && (
        <EmployeeModal
          employee={modalEmp?.id ? modalEmp : null}
          departments={departments}
          onClose={() => setModalEmp(null)}
        />
      )}
    </div>
  )
}
