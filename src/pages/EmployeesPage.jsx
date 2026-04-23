import { useState } from 'react'
import { Search, Plus, Pencil, Trash2, User } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
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
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? 'Update employee information' : 'Enter details for the new employee'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[75vh]">
          <div className="px-6 py-5 space-y-6">
            {/* Personal Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
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
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Employment Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {field('Position', 'position')}
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <NativeSelect name="department" value={form.department} onChange={handleChange} required>
                    <option value="">Select department</option>
                    {departments?.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </NativeSelect>
                </div>
                <div className="space-y-1.5">
                  <Label>Employment Type</Label>
                  <NativeSelect name="employmentType" value={form.employmentType} onChange={handleChange}>
                    <option>Regular</option>
                    <option>Probationary</option>
                    <option>Contractual</option>
                    <option>Part-time</option>
                  </NativeSelect>
                </div>
                {field('Basic Salary (₱)', 'basicSalary', 'number', { min: 0 })}
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [modalEmp, setModalEmp] = useState(null)

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
          <Button onClick={() => setModalEmp({})}>
            <Plus size={16} /> Add Employee
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NativeSelect className="w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </NativeSelect>
        <NativeSelect className="w-44" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </NativeSelect>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: j === 0 ? 140 : 80 }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                  <User size={32} className="mx-auto mb-2 opacity-30" />
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{emp.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell><StatusBadge status={emp.employmentType} /></TableCell>
                  <TableCell className="font-medium text-slate-800">{formatCurrency(emp.basicSalary)}</TableCell>
                  <TableCell><StatusBadge status={emp.status} /></TableCell>
                  <TableCell>{formatDate(emp.hireDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setModalEmp(emp)} title="Edit">
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(emp)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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
