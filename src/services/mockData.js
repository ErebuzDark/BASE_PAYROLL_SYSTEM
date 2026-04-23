/**
 * MOCK DATA STORE
 *
 * All dummy data lives here. When migrating to a real API:
 *   - Delete this file
 *   - Update each feature's api/*.js to call the real endpoints
 *   - The hooks and components require zero changes
 */

export const MOCK_EMPLOYEES = [
  {
    id: 'EMP-001',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@company.com',
    phone: '+63 917 123 4567',
    position: 'Senior Developer',
    department: 'Engineering',
    employmentType: 'Regular',
    status: 'Active',
    hireDate: '2021-03-15',
    basicSalary: 85000,
    sssNumber: '34-1234567-8',
    philhealthNumber: '12-345678901-2',
    pagibigNumber: '1234-5678-9012',
    tinNumber: '123-456-789-000',
    bankAccount: 'BDO - 1234567890',
    avatar: null,
  },
  {
    id: 'EMP-002',
    firstName: 'Juan',
    lastName: 'dela Cruz',
    email: 'juan.delacruz@company.com',
    phone: '+63 918 234 5678',
    position: 'Project Manager',
    department: 'Operations',
    employmentType: 'Regular',
    status: 'Active',
    hireDate: '2020-07-01',
    basicSalary: 95000,
    sssNumber: '34-2345678-9',
    philhealthNumber: '12-456789012-3',
    pagibigNumber: '2345-6789-0123',
    tinNumber: '234-567-890-000',
    bankAccount: 'BPI - 2345678901',
    avatar: null,
  },
  {
    id: 'EMP-003',
    firstName: 'Ana',
    lastName: 'Reyes',
    email: 'ana.reyes@company.com',
    phone: '+63 919 345 6789',
    position: 'HR Specialist',
    department: 'Human Resources',
    employmentType: 'Regular',
    status: 'Active',
    hireDate: '2022-01-10',
    basicSalary: 45000,
    sssNumber: '34-3456789-0',
    philhealthNumber: '12-567890123-4',
    pagibigNumber: '3456-7890-1234',
    tinNumber: '345-678-901-000',
    bankAccount: 'Metrobank - 3456789012',
    avatar: null,
  },
  {
    id: 'EMP-004',
    firstName: 'Carlo',
    lastName: 'Bautista',
    email: 'carlo.bautista@company.com',
    phone: '+63 920 456 7890',
    position: 'UI/UX Designer',
    department: 'Design',
    employmentType: 'Probationary',
    status: 'Active',
    hireDate: '2024-06-01',
    basicSalary: 40000,
    sssNumber: '34-4567890-1',
    philhealthNumber: '12-678901234-5',
    pagibigNumber: '4567-8901-2345',
    tinNumber: '456-789-012-000',
    bankAccount: 'UnionBank - 4567890123',
    avatar: null,
  },
  {
    id: 'EMP-005',
    firstName: 'Liza',
    lastName: 'Gomez',
    email: 'liza.gomez@company.com',
    phone: '+63 921 567 8901',
    position: 'Accountant',
    department: 'Finance',
    employmentType: 'Regular',
    status: 'On Leave',
    hireDate: '2019-11-20',
    basicSalary: 55000,
    sssNumber: '34-5678901-2',
    philhealthNumber: '12-789012345-6',
    pagibigNumber: '5678-9012-3456',
    tinNumber: '567-890-123-000',
    bankAccount: 'BDO - 5678901234',
    avatar: null,
  },
  {
    id: 'EMP-006',
    firstName: 'Roberto',
    lastName: 'Villanueva',
    email: 'roberto.villanueva@company.com',
    phone: '+63 922 678 9012',
    position: 'Sales Manager',
    department: 'Sales',
    employmentType: 'Regular',
    status: 'Active',
    hireDate: '2018-05-14',
    basicSalary: 75000,
    sssNumber: '34-6789012-3',
    philhealthNumber: '12-890123456-7',
    pagibigNumber: '6789-0123-4567',
    tinNumber: '678-901-234-000',
    bankAccount: 'BPI - 6789012345',
    avatar: null,
  },
  {
    id: 'EMP-007',
    firstName: 'Varon',
    lastName: 'Gentica',
    email: 'varongentica05@gmail.com',
    phone: '+63 966 148 3596',
    position: 'Junior Front-End Developer',
    department: 'Information Technology',
    employmentType: 'Regular',
    status: 'Active',
    hireDate: '2025-06-29',
    basicSalary: 24000,
    sssNumber: '34-6789012-3',
    philhealthNumber: '12-890123456-7',
    pagibigNumber: '6789-0123-4567',
    tinNumber: '678-901-234-000',
    bankAccount: 'BPI - 6789012345',
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNMsrc3RMIMtRsfMPjnaiDkovb-lF-4VsEA&s",
  },
]

export const MOCK_DEPARTMENTS = [
  { id: 'dept-1', name: 'Engineering', headCount: 2, budget: 500000 },
  { id: 'dept-2', name: 'Operations', headCount: 1, budget: 200000 },
  { id: 'dept-3', name: 'Human Resources', headCount: 1, budget: 150000 },
  { id: 'dept-4', name: 'Design', headCount: 1, budget: 120000 },
  { id: 'dept-5', name: 'Finance', headCount: 1, budget: 180000 },
  { id: 'dept-6', name: 'Sales', headCount: 1, budget: 250000 },
  { id: 'dept-7', name: 'Information Technology', headCount: 1, budget: 1000000 },
]

export const MOCK_ATTENDANCE = [
  { id: 'att-1', employeeId: 'EMP-001', date: '2025-04-01', timeIn: '08:02', timeOut: '17:05', status: 'Present', hoursWorked: 9.05 },
  { id: 'att-2', employeeId: 'EMP-001', date: '2025-04-02', timeIn: '08:15', timeOut: '17:00', status: 'Late', hoursWorked: 8.75 },
  { id: 'att-3', employeeId: 'EMP-001', date: '2025-04-03', timeIn: null, timeOut: null, status: 'Absent', hoursWorked: 0 },
  { id: 'att-4', employeeId: 'EMP-002', date: '2025-04-01', timeIn: '07:55', timeOut: '17:10', status: 'Present', hoursWorked: 9.25 },
  { id: 'att-5', employeeId: 'EMP-002', date: '2025-04-02', timeIn: '08:00', timeOut: '17:00', status: 'Present', hoursWorked: 9 },
  { id: 'att-6', employeeId: 'EMP-003', date: '2025-04-01', timeIn: '08:00', timeOut: '17:00', status: 'Present', hoursWorked: 9 },
  { id: 'att-7', employeeId: 'EMP-004', date: '2025-04-01', timeIn: '09:00', timeOut: '18:00', status: 'Present', hoursWorked: 9 },
  { id: 'att-8', employeeId: 'EMP-005', date: '2025-04-01', timeIn: null, timeOut: null, status: 'On Leave', hoursWorked: 0 },
  { id: 'att-9', employeeId: 'EMP-007', date: '2025-04-01', timeIn: '7:30', timeOut: '4:30', status: 'Present', hoursWorked: 9 },
]

export const MOCK_LEAVES = [
  { id: 'lv-1', employeeId: 'EMP-005', type: 'Sick Leave', startDate: '2025-04-01', endDate: '2025-04-05', days: 5, status: 'Approved', reason: 'Medical consultation' },
  { id: 'lv-2', employeeId: 'EMP-001', type: 'Vacation Leave', startDate: '2025-04-20', endDate: '2025-04-22', days: 3, status: 'Pending', reason: 'Family vacation' },
  { id: 'lv-3', employeeId: 'EMP-003', type: 'Emergency Leave', startDate: '2025-03-10', endDate: '2025-03-11', days: 2, status: 'Approved', reason: 'Family emergency' },
]

export let MOCK_DEDUCTION_TYPES = [
  { id: 'ded-type-1', name: 'SSS', type: 'Government', description: 'Social Security System contribution' },
  { id: 'ded-type-2', name: 'PhilHealth', type: 'Government', description: 'Philippine Health Insurance' },
  { id: 'ded-type-3', name: 'Pag-IBIG', type: 'Government', description: 'Home Development Mutual Fund' },
  { id: 'ded-type-4', name: 'Withholding Tax', type: 'Tax', description: 'BIR income tax withholding' },
  { id: 'ded-type-5', name: 'SSS Loan', type: 'Loan', description: 'SSS salary loan repayment' },
  { id: 'ded-type-6', name: 'Pag-IBIG Loan', type: 'Loan', description: 'Pag-IBIG multi-purpose loan' },
  { id: 'ded-type-7', name: 'Company Loan', type: 'Loan', description: 'Internal company loan' },
  { id: 'ded-type-8', name: 'Late/Absent', type: 'Penalty', description: 'Deduction for tardiness and absences' },
]

export let MOCK_ALLOWANCE_TYPES = [
  { id: 'all-type-1', name: 'Transportation', taxable: false },
  { id: 'all-type-2', name: 'Meal', taxable: false },
  { id: 'all-type-3', name: 'Communication', taxable: false },
  { id: 'all-type-4', name: 'Performance Bonus', taxable: true },
  { id: 'all-type-5', name: 'Overtime Pay', taxable: true },
  { id: 'all-type-6', name: '13th Month Pay', taxable: false },
  { id: 'all-type-7', name: 'Housing', taxable: false },
]

/**
 * Payroll Runs - represents processed payroll periods
 * Each run has computed payslips per employee
 */
export const MOCK_PAYROLL_RUNS = [
  {
    id: 'pr-001',
    period: 'April 1–15, 2025',
    periodStart: '2025-04-01',
    periodEnd: '2025-04-15',
    cutoff: '1st Cutoff',
    status: 'Draft',
    totalGross: 197916.67,
    totalDeductions: 28450.00,
    totalNet: 169466.67,
    processedAt: null,
    approvedBy: null,
    payslips: [
      {
        id: 'ps-001', employeeId: 'EMP-001', payrollRunId: 'pr-001',
        basicPay: 42500, daysWorked: 15, hoursRegular: 120,
        overtimeHours: 5, overtimePay: 2656.25,
        allowances: [
          { type: 'Transportation', amount: 2000, taxable: false },
          { type: 'Meal', amount: 1500, taxable: false },
        ],
        grossPay: 48656.25,
        deductions: [
          { type: 'SSS', amount: 1125, category: 'Government' },
          { type: 'PhilHealth', amount: 425, category: 'Government' },
          { type: 'Pag-IBIG', amount: 200, category: 'Government' },
          { type: 'Withholding Tax', amount: 3500, category: 'Tax' },
        ],
        totalDeductions: 5250,
        netPay: 43406.25,
        status: 'Draft',
      },
      {
        id: 'ps-002', employeeId: 'EMP-002', payrollRunId: 'pr-001',
        basicPay: 47500, daysWorked: 15, hoursRegular: 120,
        overtimeHours: 0, overtimePay: 0,
        allowances: [
          { type: 'Transportation', amount: 2000, taxable: false },
          { type: 'Meal', amount: 1500, taxable: false },
          { type: 'Communication', amount: 1000, taxable: false },
        ],
        grossPay: 52000,
        deductions: [
          { type: 'SSS', amount: 1125, category: 'Government' },
          { type: 'PhilHealth', amount: 475, category: 'Government' },
          { type: 'Pag-IBIG', amount: 200, category: 'Government' },
          { type: 'Withholding Tax', amount: 4500, category: 'Tax' },
          { type: 'SSS Loan', amount: 1000, category: 'Loan' },
        ],
        totalDeductions: 7300,
        netPay: 44700,
        status: 'Draft',
      },
      {
        id: 'ps-003', employeeId: 'EMP-003', payrollRunId: 'pr-001',
        basicPay: 22500, daysWorked: 15, hoursRegular: 120,
        overtimeHours: 0, overtimePay: 0,
        allowances: [
          { type: 'Transportation', amount: 2000, taxable: false },
          { type: 'Meal', amount: 1500, taxable: false },
        ],
        grossPay: 26000,
        deductions: [
          { type: 'SSS', amount: 900, category: 'Government' },
          { type: 'PhilHealth', amount: 225, category: 'Government' },
          { type: 'Pag-IBIG', amount: 200, category: 'Government' },
          { type: 'Withholding Tax', amount: 800, category: 'Tax' },
        ],
        totalDeductions: 2125,
        netPay: 23875,
        status: 'Draft',
      },
    ],
  },
  {
    id: 'pr-002',
    period: 'March 16–31, 2025',
    periodStart: '2025-03-16',
    periodEnd: '2025-03-31',
    cutoff: '2nd Cutoff',
    status: 'Released',
    totalGross: 395833.34,
    totalDeductions: 56900.00,
    totalNet: 338933.34,
    processedAt: '2025-04-03T10:30:00Z',
    approvedBy: 'Admin User',
    payslips: [],
  },
  {
    id: 'pr-003',
    period: 'March 1–15, 2025',
    periodStart: '2025-03-01',
    periodEnd: '2025-03-15',
    cutoff: '1st Cutoff',
    status: 'Released',
    totalGross: 395833.34,
    totalDeductions: 56900.00,
    totalNet: 338933.34,
    processedAt: '2025-03-18T09:15:00Z',
    approvedBy: 'Admin User',
    payslips: [],
  },
]

export const MOCK_DASHBOARD_STATS = {
  totalEmployees: 6,
  activeEmployees: 5,
  onLeave: 1,
  totalPayrollThisMonth: 677866.68,
  payrollGrowth: 3.2,
  pendingPayrolls: 1,
  upcomingPayroll: 'April 16–30, 2025',
  attendanceTodayPresent: 4,
  attendanceTodayAbsent: 1,
  attendanceTodayLate: 1,
  pendingLeaveRequests: 1,
}

export const MOCK_PAYROLL_TREND = [
  { month: 'Nov', gross: 650000, net: 555000 },
  { month: 'Dec', gross: 820000, net: 700000 },
  { month: 'Jan', gross: 670000, net: 572000 },
  { month: 'Feb', gross: 660000, net: 564000 },
  { month: 'Mar', gross: 677867, net: 577933 },
  { month: 'Apr', gross: 395000, net: 337400 },
]

export const MOCK_DEPARTMENT_COSTS = [
  { department: 'Engineering', cost: 255000 },
  { department: 'Operations', cost: 142500 },
  { department: 'Sales', cost: 112500 },
  { department: 'Finance', cost: 82500 },
  { department: 'HR', cost: 67500 },
  { department: 'Design', cost: 60000 },
]

export let MOCK_COMPANY_SETTINGS = {
  companyName: 'Your Company Inc.',
  currency: 'PHP (Philippine Peso)',
  paySchedule: 'Semi-Monthly (1st & 16th)',
  workDaysPerWeek: 5,
  workHoursPerDay: 8,
  otRateMultiplier: 1.25,
}

/**
 * Leave Balances — per-employee leave credit allocations
 */
export const MOCK_LEAVE_BALANCES = [
  // EMP-001 Maria Santos
  { employeeId: 'EMP-001', type: 'Vacation Leave', total: 15, used: 3, remaining: 12 },
  { employeeId: 'EMP-001', type: 'Sick Leave', total: 15, used: 2, remaining: 13 },
  { employeeId: 'EMP-001', type: 'Emergency Leave', total: 5, used: 0, remaining: 5 },
  { employeeId: 'EMP-001', type: 'Maternity Leave', total: 105, used: 0, remaining: 105 },
  { employeeId: 'EMP-001', type: 'Paternity Leave', total: 0, used: 0, remaining: 0 },
  // EMP-002 Juan dela Cruz
  { employeeId: 'EMP-002', type: 'Vacation Leave', total: 15, used: 5, remaining: 10 },
  { employeeId: 'EMP-002', type: 'Sick Leave', total: 15, used: 1, remaining: 14 },
  { employeeId: 'EMP-002', type: 'Emergency Leave', total: 5, used: 1, remaining: 4 },
  { employeeId: 'EMP-002', type: 'Maternity Leave', total: 0, used: 0, remaining: 0 },
  { employeeId: 'EMP-002', type: 'Paternity Leave', total: 7, used: 0, remaining: 7 },
  // EMP-003 Ana Reyes
  { employeeId: 'EMP-003', type: 'Vacation Leave', total: 15, used: 4, remaining: 11 },
  { employeeId: 'EMP-003', type: 'Sick Leave', total: 15, used: 0, remaining: 15 },
  { employeeId: 'EMP-003', type: 'Emergency Leave', total: 5, used: 2, remaining: 3 },
  { employeeId: 'EMP-003', type: 'Maternity Leave', total: 105, used: 0, remaining: 105 },
  { employeeId: 'EMP-003', type: 'Paternity Leave', total: 0, used: 0, remaining: 0 },
  // EMP-004 Carlo Bautista
  { employeeId: 'EMP-004', type: 'Vacation Leave', total: 10, used: 0, remaining: 10 },
  { employeeId: 'EMP-004', type: 'Sick Leave', total: 10, used: 0, remaining: 10 },
  { employeeId: 'EMP-004', type: 'Emergency Leave', total: 3, used: 0, remaining: 3 },
  { employeeId: 'EMP-004', type: 'Maternity Leave', total: 0, used: 0, remaining: 0 },
  { employeeId: 'EMP-004', type: 'Paternity Leave', total: 7, used: 0, remaining: 7 },
  // EMP-005 Liza Gomez
  { employeeId: 'EMP-005', type: 'Vacation Leave', total: 15, used: 8, remaining: 7 },
  { employeeId: 'EMP-005', type: 'Sick Leave', total: 15, used: 5, remaining: 10 },
  { employeeId: 'EMP-005', type: 'Emergency Leave', total: 5, used: 0, remaining: 5 },
  { employeeId: 'EMP-005', type: 'Maternity Leave', total: 105, used: 0, remaining: 105 },
  { employeeId: 'EMP-005', type: 'Paternity Leave', total: 0, used: 0, remaining: 0 },
  // EMP-006 Roberto Villanueva
  { employeeId: 'EMP-006', type: 'Vacation Leave', total: 15, used: 2, remaining: 13 },
  { employeeId: 'EMP-006', type: 'Sick Leave', total: 15, used: 3, remaining: 12 },
  { employeeId: 'EMP-006', type: 'Emergency Leave', total: 5, used: 1, remaining: 4 },
  { employeeId: 'EMP-006', type: 'Maternity Leave', total: 0, used: 0, remaining: 0 },
  { employeeId: 'EMP-006', type: 'Paternity Leave', total: 7, used: 0, remaining: 7 },
  // EMP-006 Roberto Villanueva
  { employeeId: 'EMP-007', type: 'Vacation Leave', total: 15, used: 0, remaining: 15 },
  { employeeId: 'EMP-007', type: 'Sick Leave', total: 15, used: 0, remaining: 15 },
  { employeeId: 'EMP-007', type: 'Emergency Leave', total: 5, used: 0, remaining: 5 },
  { employeeId: 'EMP-007', type: 'Maternity Leave', total: 0, used: 0, remaining: 0 },
  { employeeId: 'EMP-007', type: 'Paternity Leave', total: 7, used: 0, remaining: 7 },
]
