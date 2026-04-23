# PayrollPro — HR & Payroll System

A comprehensive payroll system built with React + Vite, Tailwind CSS v4, TanStack Query v5, and React Router v6.

## Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 5 (JSX) |
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query v5 |
| Charts | Recharts |

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | KPI cards, payroll trend chart, department cost breakdown, attendance summary |
| **Employees** | Full CRUD — add, edit, delete employees with government ID tracking |
| **Payroll** | Create payroll runs, process, release, view payslips with earnings/deductions breakdown |
| **Attendance & Leaves** | Attendance log with time-in/out, leave request management with approve/reject |
| **Reports** | YTD summary, department payroll charts, salary summary, payroll history, CSV export |
| **Settings** | Deduction types, allowance types, company payroll settings |

---

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

---

## Migrating to a Real API

The system is built for zero-friction migration. All dummy data is isolated in one place.

### Step 1 — Update `.env.local`

```env
VITE_USE_MOCK=false
VITE_API_URL=https://api.yourcompany.com
```

### Step 2 — Update API functions

Each feature has an `api/` folder. The mock and real API calls are side-by-side:

```
src/features/
  employees/api/employeesApi.js    ← swap mock → real
  payroll/api/payrollApi.js        ← swap mock → real
  attendance/api/attendanceApi.js  ← swap mock → real
  reports/api/dashboardApi.js      ← swap mock → real
```

In each file, simply remove the `if (USE_MOCK) { ... }` block and uncomment the `api.*` call below it. The hooks and components require **zero changes**.

### Step 3 — Delete mock data

Once migrated, delete `src/services/mockData.js`.

---

## Expected API Endpoints

```
GET    /employees
GET    /employees/:id
POST   /employees
PUT    /employees/:id
DELETE /employees/:id
GET    /departments

GET    /payroll-runs
GET    /payroll-runs/:id
POST   /payroll-runs
PUT    /payroll-runs/:id/process
PUT    /payroll-runs/:id/release
GET    /payroll-runs/:id/payslips

GET    /attendance
GET    /leaves
PUT    /leaves/:id/status

GET    /dashboard/stats
GET    /dashboard/payroll-trend
GET    /dashboard/department-costs

GET    /reports/payroll/export
PUT    /settings/company
```

---

## Project Structure

```
src/
├── features/
│   ├── employees/
│   │   ├── api/employeesApi.js      ← API calls (mock + real)
│   │   └── hooks/useEmployees.js    ← TanStack Query hooks
│   ├── payroll/
│   │   ├── api/payrollApi.js
│   │   └── hooks/usePayroll.js
│   ├── attendance/
│   │   ├── api/attendanceApi.js
│   │   └── hooks/useAttendance.js
│   └── reports/
│       ├── api/dashboardApi.js
│       └── hooks/useDashboard.js
├── pages/                           ← Route-level components
├── components/shared/               ← Layout, Sidebar, reusable components
├── services/
│   ├── api.js                       ← Axios instance with interceptors
│   └── mockData.js                  ← All dummy data (delete when migrating)
├── styles/globals.css               ← Tailwind v4 design tokens
└── routes/index.jsx                 ← React Router config
```
