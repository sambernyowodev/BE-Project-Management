# HCM PROJECT MANAGEMENT APPLICATION
## Full-Stack Implementation Plan for Antigravity (Google Agent-First IDE)

---

## PROJECT OVERVIEW

Build a production-ready Project Management System for HCM (Human Capital Management) team with these core modules:
1. **Project Management** - Timeline, resource planning, multi-role members
2. **Support Ticket Tracking** - Issue tracking with hours/mandays
3. **Purchase Order (PO) Management** - PO creation, SO tracking, billing
4. **Role Rate Management** - Rate harga per role (global & project-specific)
5. **Billing/Penagihan** - Invoice generation based on date range
6. **Reporting** - Excel export matching existing lampiran format

---

## TECH STACK

### Backend
- **NestJS 11** - Modular architecture with dependency injection
- **TypeORM** - ORM with decorators, MySQL driver
- **MySQL 8.0** - Relational database
- **class-validator + class-transformer** - DTO validation
- **@nestjs/swagger** - OpenAPI documentation
- **exceljs** - Excel generation for reports
- **@nestjs/config** - Environment configuration
- **JWT + Passport** - Authentication

### Frontend
- **React 19** - Latest with concurrent features
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **TanStack Query (React Query)** - Server state management
- **React Router v7** - Client-side routing
- **shadcn/ui** - Accessible component primitives
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **SheetJS (xlsx)** - Excel export
- **Recharts** - Data visualization

---

## DATABASE SCHEMA

### Core Tables

```sql
-- Users & Authentication
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (code, name) VALUES
('PM','Project Manager'), ('TL','Tech Lead'), ('BA','Business Analyst'),
('QA','Quality Assurance'), ('TW','Technical Writer'), ('DEV','Developer'),
('FE','Frontend Developer'), ('BE','Backend Developer'), ('DESIGNER','UI/UX Designer');

-- User Roles (Many-to-Many)
CREATE TABLE user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_role (user_id, role_id)
);

-- Role Rates (Rate Harga per Role - GLOBAL & PROJECT-SPECIFIC)
CREATE TABLE role_rates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NULL,
    rate_per_manday DECIMAL(12,2) NOT NULL DEFAULT 0,
    rate_per_hour DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'IDR',
    effective_from DATE NOT NULL,
    effective_until DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_project_effective (role_id, project_id, effective_from)
);

-- Seed global rates
INSERT INTO role_rates (role_id, project_id, rate_per_manday, rate_per_hour, effective_from) VALUES
((SELECT id FROM roles WHERE code='PM'), NULL, 2500000, 312500, '2026-01-01'),
((SELECT id FROM roles WHERE code='TL'), NULL, 2200000, 275000, '2026-01-01'),
((SELECT id FROM roles WHERE code='BA'), NULL, 1800000, 225000, '2026-01-01'),
((SELECT id FROM roles WHERE code='QA'), NULL, 1600000, 200000, '2026-01-01'),
((SELECT id FROM roles WHERE code='DEV'), NULL, 2000000, 250000, '2026-01-01'),
((SELECT id FROM roles WHERE code='FE'), NULL, 2000000, 250000, '2026-01-01'),
((SELECT id FROM roles WHERE code='BE'), NULL, 2100000, 262500, '2026-01-01'),
((SELECT id FROM roles WHERE code='DESIGNER'), NULL, 1700000, 212500, '2026-01-01');

-- Projects
CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pic_client VARCHAR(255),
    platform VARCHAR(100),
    status ENUM('PLANNING','IN_PROGRESS','SIT','UAT','CLOSED','ON_HOLD','CANCELLED') DEFAULT 'PLANNING',
    total_mandays DECIMAL(8,2) DEFAULT 0,
    start_date DATE, end_date DATE,
    actual_start DATE, actual_end DATE,
    progress_pct DECIMAL(5,2) DEFAULT 0,
    customer VARCHAR(255),
    repository_link VARCHAR(500),
    timeline_link VARCHAR(500),
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Project Members (MULTI-ROLE: primary + secondary)
CREATE TABLE project_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    secondary_role_id BIGINT UNSIGNED NULL,
    assigned_mandays DECIMAL(8,2) DEFAULT 0,
    actual_mandays DECIMAL(8,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (secondary_role_id) REFERENCES roles(id)
);

-- Project Activities (Timeline/Gantt)
CREATE TABLE project_activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    feature VARCHAR(255), sub_feature VARCHAR(255), details TEXT,
    duration_days INT DEFAULT 0, mandays DECIMAL(8,2) DEFAULT 0,
    start_date DATE, end_date DATE,
    actual_start DATE, actual_end DATE,
    progress_pct DECIMAL(5,2) DEFAULT 0,
    phase ENUM('FCAB','REQUIREMENT','ANALYSIS','DESIGN','SRS','CRQ','DEVELOPMENT','UT_SIT','TRA_TC','REVIEW','SIT','UAT','NFT','SECURITY','RFS','FUT') DEFAULT 'DEVELOPMENT',
    assigned_to BIGINT UNSIGNED NULL,
    sort_order INT DEFAULT 0,
    is_milestone BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES project_activities(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Purchase Orders (PO)
CREATE TABLE purchase_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    po_name VARCHAR(255) NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    customer VARCHAR(255) NOT NULL,
    description TEXT,
    total_mandays DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('DRAFT','ACTIVE','IN_PROGRESS','COMPLETED','CLOSED','CANCELLED') DEFAULT 'DRAFT',
    start_date DATE, end_date DATE,
    signed_date DATE,
    document_url VARCHAR(500),
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sales Orders (SO - child of PO)
CREATE TABLE sales_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    so_number VARCHAR(100) NOT NULL UNIQUE,
    so_name VARCHAR(255) NOT NULL,
    po_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    description TEXT,
    total_mandays DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('DRAFT','ACTIVE','IN_PROGRESS','DELIVERED','INVOICED','PAID','CLOSED','CANCELLED') DEFAULT 'DRAFT',
    start_date DATE, end_date DATE,
    delivery_date DATE, invoice_date DATE, payment_date DATE,
    document_url VARCHAR(500),
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- PO-SO Members (linking members to PO/SO with actuals)
CREATE TABLE po_so_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    po_id BIGINT UNSIGNED NOT NULL,
    so_id BIGINT UNSIGNED NULL,
    project_member_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    actual_mandays DECIMAL(8,2) DEFAULT 0,
    actual_hours DECIMAL(8,2) DEFAULT 0,
    rate_per_manday DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    start_date DATE, end_date DATE,
    is_billable BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (so_id) REFERENCES sales_orders(id),
    FOREIGN KEY (project_member_id) REFERENCES project_members(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Support Tickets
CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    project_id BIGINT UNSIGNED NULL,
    project_name VARCHAR(255) NOT NULL,
    pic_client VARCHAR(255),
    issue_title VARCHAR(500) NOT NULL,
    issue_description TEXT,
    hours_spent DECIMAL(6,2) DEFAULT 0,
    mandays_spent DECIMAL(6,2) DEFAULT 0,
    status ENUM('OPEN','IN_PROGRESS','DEV_DONE','SIT_DONE','UAT_DONE','DONE','ON_HOLD','CANCELLED') DEFAULT 'OPEN',
    platform VARCHAR(100),
    start_date DATE, end_date DATE,
    business_analyst_id BIGINT UNSIGNED NULL,
    ui_ux_id BIGINT UNSIGNED NULL,
    dev_fe_id BIGINT UNSIGNED NULL,
    dev_be_id BIGINT UNSIGNED NULL,
    folder_attachment VARCHAR(500),
    notes TEXT,
    update_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (business_analyst_id) REFERENCES users(id),
    FOREIGN KEY (ui_ux_id) REFERENCES users(id),
    FOREIGN KEY (dev_fe_id) REFERENCES users(id),
    FOREIGN KEY (dev_be_id) REFERENCES users(id)
);

-- Support Ticket Details (sub-issues)
CREATE TABLE support_ticket_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    support_ticket_id BIGINT UNSIGNED NOT NULL,
    sub_issue VARCHAR(500) NOT NULL,
    hours_spent DECIMAL(6,2) DEFAULT 0,
    status ENUM('OPEN','IN_PROGRESS','DONE','ON_HOLD') DEFAULT 'OPEN',
    platform VARCHAR(100),
    start_date DATE, end_date DATE,
    dev_be_names VARCHAR(500),
    FOREIGN KEY (support_ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);

-- Billing Invoices
CREATE TABLE billing_invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    po_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    total_mandays DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) DEFAULT 0,
    status ENUM('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'DRAFT',
    invoice_date DATE, due_date DATE, paid_date DATE,
    document_url VARCHAR(500),
    remarks TEXT,
    created_by BIGINT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Billing Invoice Details
CREATE TABLE billing_invoice_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    mandays DECIMAL(8,2) DEFAULT 0,
    rate_per_manday DECIMAL(12,2) DEFAULT 0,
    subtotal DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES billing_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

---

## BACKEND IMPLEMENTATION (NestJS)

### Module Structure
```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── database.config.ts
│   └── app.config.ts
├── common/
│   ├── decorators/ (current-user.decorator, roles.decorator)
│   ├── guards/ (jwt-auth.guard, roles.guard)
│   ├── interceptors/ (transform.interceptor)
│   └── filters/ (http-exception.filter)
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts, auth.controller.ts, auth.service.ts
│   │   ├── dto/login.dto.ts, register.dto.ts
│   │   └── strategies/jwt.strategy.ts
│   ├── users/
│   │   ├── users.module.ts, users.controller.ts, users.service.ts
│   │   ├── entities/user.entity.ts
│   │   └── dto/
│   ├── roles/
│   │   ├── roles.module.ts, roles.controller.ts, roles.service.ts
│   │   └── entities/role.entity.ts
│   ├── role-rates/
│   │   ├── role-rates.module.ts, role-rates.controller.ts, role-rates.service.ts
│   │   ├── entities/role-rate.entity.ts
│   │   └── dto/create-role-rate.dto.ts
│   ├── projects/
│   │   ├── projects.module.ts, projects.controller.ts, projects.service.ts
│   │   ├── entities/project.entity.ts, project-member.entity.ts
│   │   └── dto/create-project.dto.ts, add-member.dto.ts, project-filter.dto.ts
│   ├── project-activities/
│   │   ├── project-activities.module.ts, project-activities.controller.ts, project-activities.service.ts
│   │   ├── entities/project-activity.entity.ts
│   │   └── dto/create-activity.dto.ts
│   ├── purchase-orders/
│   │   ├── purchase-orders.module.ts, purchase-orders.controller.ts, purchase-orders.service.ts
│   │   ├── entities/purchase-order.entity.ts
│   │   └── dto/create-po.dto.ts
│   ├── sales-orders/
│   │   ├── sales-orders.module.ts, sales-orders.controller.ts, sales-orders.service.ts
│   │   ├── entities/sales-order.entity.ts
│   │   └── dto/create-so.dto.ts
│   ├── po-so-members/
│   │   ├── po-so-members.module.ts, po-so-members.controller.ts, po-so-members.service.ts
│   │   └── dto/assign-member.dto.ts
│   ├── support-tickets/
│   │   ├── support-tickets.module.ts, support-tickets.controller.ts, support-tickets.service.ts
│   │   ├── entities/support-ticket.entity.ts, support-ticket-detail.entity.ts
│   │   └── dto/create-ticket.dto.ts
│   └── billing/
│       ├── billing.module.ts, billing.controller.ts, billing.service.ts
│       ├── entities/billing-invoice.entity.ts, billing-invoice-detail.entity.ts
│       └── dto/generate-invoice.dto.ts
└── database/migrations/
```

### Key API Endpoints
```
Auth:
  POST /api/auth/login
  POST /api/auth/register
  GET  /api/auth/me

Users:
  GET    /api/users
  GET    /api/users/:id
  POST   /api/users/:id/roles

Role Rates:
  GET    /api/role-rates
  GET    /api/role-rates/global
  GET    /api/role-rates/project/:projectId
  POST   /api/role-rates

Projects:
  GET    /api/projects
  GET    /api/projects/:id
  POST   /api/projects
  PUT    /api/projects/:id
  GET    /api/projects/:id/members
  POST   /api/projects/:id/members
  GET    /api/projects/:id/activities

Purchase Orders:
  GET    /api/purchase-orders
  GET    /api/purchase-orders/:id
  POST   /api/purchase-orders
  GET    /api/purchase-orders/project/:projectId
  GET    /api/purchase-orders/:id/sales-orders

Sales Orders:
  GET    /api/sales-orders
  POST   /api/sales-orders
  PUT    /api/sales-orders/:id/status

Billing:
  POST   /api/billing/generate-preview
  POST   /api/billing/create-invoice
  GET    /api/billing/invoices
  GET    /api/billing/invoices/:id
  GET    /api/billing/invoices/:id/download
  GET    /api/billing/dashboard

Support Tickets:
  GET    /api/support-tickets
  POST   /api/support-tickets
  GET    /api/support-tickets/:id
  POST   /api/support-tickets/:id/details
```

### Critical Service Logic

```typescript
// billing.service.ts - Invoice Generation

async generatePreview(dto: GenerateInvoiceDto) {
  // 1. Get PO and Project
  const po = await this.poRepo.findOne({ where: { id: dto.poId }, relations: ['project'] });

  // 2. Get members with actual mandays in period
  const members = await this.poSoMemberRepo.find({
    where: { poId: dto.poId, isBillable: true },
    relations: ['role', 'projectMember', 'projectMember.user']
  });

  // 3. Get applicable rates (project-specific -> global fallback)
  const rateMap = new Map<number, number>();
  for (const member of members) {
    let rate = await this.roleRateRepo.findOne({
      where: {
        roleId: member.roleId,
        projectId: dto.projectId,
        isActive: true,
        effectiveFrom: LessThanOrEqual(dto.endDate),
        effectiveUntil: Or(MoreThanOrEqual(dto.startDate), IsNull())
      },
      order: { effectiveFrom: 'DESC' }
    });

    if (!rate) {
      rate = await this.roleRateRepo.findOne({
        where: { roleId: member.roleId, projectId: IsNull(), isActive: true },
        order: { effectiveFrom: 'DESC' }
      });
    }
    rateMap.set(member.roleId, rate?.ratePerManday || 0);
  }

  // 4. Calculate breakdown per role
  const breakdown = members.reduce((acc, member) => {
    const rate = rateMap.get(member.roleId) || 0;
    const cost = member.actualMandays * rate;
    const roleCode = member.role.code;

    if (!acc[roleCode]) {
      acc[roleCode] = { roleName: member.role.name, mandays: 0, rate, subtotal: 0, members: [] };
    }
    acc[roleCode].mandays += member.actualMandays;
    acc[roleCode].subtotal += cost;
    acc[roleCode].members.push({ name: member.projectMember.user.fullName, mandays: member.actualMandays, cost });
    return acc;
  }, {});

  const totalMandays = Object.values(breakdown).reduce((s: number, r: any) => s + r.mandays, 0);
  const totalAmount = Object.values(breakdown).reduce((s: number, r: any) => s + r.subtotal, 0);
  const taxAmount = totalAmount * (dto.taxRate || 0) / 100;

  return { po, project: po.project, period: { start: dto.startDate, end: dto.endDate },
    roleBreakdown: Object.values(breakdown), totalMandays, totalAmount, taxAmount,
    grandTotal: totalAmount + taxAmount, taxRate: dto.taxRate || 0 };
}

// Auto-numbering
function generatePONumber(): string {
  const year = new Date().getFullYear();
  const prefix = `PO-HCM-${year}-`;
  // Get last number and increment
}

function generateSONumber(poNumber: string): string {
  // SO-HCM-YYYY-NNN-A, -B, etc.
}

function generateInvoiceNumber(): string {
  const now = new Date();
  const prefix = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-`;
  // Get last sequence
}
```

---

## ENVIRONMENT CONFIGURATION

### Backend .env
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hcm_project_mgmt
DB_USER=root
DB_PASSWORD=secret
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

## ENTITY RELATIONSHIP SUMMARY

```
users ---- user_roles ---- roles
                  |
                  ---- role_rates (global or project-specific)

projects ---- project_members ---- users + roles (primary + secondary)
          |
          ---- project_activities (hierarchical parent-child)
          ---- support_tickets ---- support_ticket_details
          ---- purchase_orders ---- sales_orders
          |                       |
          |                       ---- po_so_members
          ---- billing_invoices ---- billing_invoice_details
```
Build a production-ready full-stack Project Management System for an HCM (Human Capital Management) team.

BACKEND: NestJS 11 + TypeORM + MySQL 8
- Create all modules: Auth (JWT), Users, Roles, RoleRates, Projects, ProjectMembers, ProjectActivities, PurchaseOrders, SalesOrders, PoSoMembers, SupportTickets, SupportTicketDetails, BillingInvoices
- Implement auto-numbering: Project (HCM-YYYY-NNN), PO (PO-HCM-YYYY-NNN), SO (SO-HCM-YYYY-NNN-A), Invoice (INV-YYYYMM-NNN)
- Implement billing calculation: actual_mandays multiplied by applicable_rate_per_role (project-specific rate falls back to global rate)
- Generate Swagger docs at /api/docs
- Use class-validator for all DTOs
- Implement proper error handling and response transformation
