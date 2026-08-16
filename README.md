# Employee Management System — Frontend SPA

A modern, responsive, enterprise-grade Employee Management dashboard built with **Angular 19**, **TypeScript**, **Angular Material**, and **Chart.js**.

---

## Live Backend API

The frontend is pre-configured to connect to the live backend:
- **API Base URL**: `http://221.132.16.77:5050/api`
- **Swagger Docs**: `http://221.132.16.77:5050/swagger`

---

## Features

- **Authentication & Security**:
  - Secure JWT authentication with functional interceptors (`authInterceptor`, `errorInterceptor`).
  - Route-level role-based guards (`authGuard`, `roleGuard`).
  - Session auto-refresh and automatic logout on token expiry.
- **Analytics & Dashboard**:
  - KPI Stat cards (Total Employees, Active, On Leave, Departments).
  - Visual charts powered by Chart.js (Department distribution doughnut, Employment type bar chart).
  - Recent employees activity list & quick navigation actions.
- **Employee Directory**:
  - Full CRUD operations (Add, View Detail, Edit, Delete with modal confirmation).
  - Real-time search by name, email, employee code, or designation.
  - Multi-criteria filtering (Department, Employment Status, Employment Type).
  - Server-side sorting & responsive pagination.
- **Department & Role Management**:
  - Department management with dynamic employee count tracking.
  - Role management with permission levels.
- **My Profile**:
  - Dedicated personal profile page for employees with status badges.
- **UI & UX**:
  - Responsive collapsible sidebar with dark gradient theme.
  - Top navbar with user initials avatar, role badge, and profile dropdown menu.
  - Form validation with inline error messaging.
  - Loading states, empty states, and toast notifications.

---

## Tech Stack

- **Angular 19** (Standalone Components & Signals ready)
- **TypeScript 5.x**
- **Angular Material 19** & Material Icons
- **Chart.js** & `ng2-charts`
- **RxJS**
- **Sass (SCSS)**

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # auth.guard.ts, role.guard.ts
│   │   ├── interceptors/    # auth.interceptor.ts, error.interceptor.ts
│   │   ├── models/          # auth.model.ts, employee.model.ts, api.model.ts
│   │   └── services/        # auth.service.ts, employee.service.ts, department.service.ts, role.service.ts, dashboard.service.ts
│   ├── features/
│   │   ├── auth/login/      # Modern login page
│   │   ├── dashboard/       # KPI cards, charts, recent activities
│   │   ├── employees/       # employee-list, employee-form, employee-detail
│   │   ├── departments/     # department-list with CRUD
│   │   ├── roles/           # role-list with CRUD
│   │   ├── profile/         # User profile view
│   │   └── not-found/       # 404 page
│   ├── layout/
│   │   ├── main-layout/     # Layout shell with sidebar + navbar
│   │   ├── navbar/          # Top navigation header
│   │   └── sidebar/         # Responsive sidebar with role filtering
│   ├── shared/
│   │   └── components/      # ConfirmDialog, LoadingSpinner, EmptyState, StatusBadge
│   ├── app.config.ts        # App providers (HttpClient, Charts, Animations)
│   └── app.routes.ts        # Lazy-loaded routes with role protection
├── environments/
│   ├── environment.ts       # Development config
│   └── environment.prod.ts  # Production config (http://221.132.16.77:5050/api)
├── index.html               # Fonts & Icons
└── styles.scss              # Global design system & theme
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`.

---

## Production Build & Deployment

### Build for Production
```bash
npm run build
```
Production output files will be generated in `dist/employee-management/browser/`.

### Deploy to Vercel / Netlify
1. Set Build Command: `npm run build`
2. Set Output Directory: `dist/employee-management/browser`
3. Add a rewrite rule for single page applications (`/*` -> `/index.html`).

---

## Default Login Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@company.com` | `Admin@123` | Full access to all modules |
| **HR** | `hr@company.com` | `Hr@12345` | Manage employees, departments, dashboard |
| **Manager** | `manager@company.com` | `Manager@123` | View employees/departments, dashboard |
| **Employee** | `employee@company.com` | `Employee@123` | View own profile & departments |
