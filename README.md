# HCM Project Management System (Backend API)

Welcome to the Backend API for the **HCM Project Management System**, built using **NestJS 11**, **TypeORM**, and **MySQL 8**. This application serves as the core backend engine to manage projects, purchase orders, team members, support tickets, billing, and work rates.

---

## 🚀 Key Modules & Architecture

The application is structured into the following modules under `src/modules/`:

1. **Authentication & Authorization (`auth`)**: JWT-based login, register/signup, profile fetching, and password modification.
2. **Master Data (`master`)**:
   - **Users (`users`)**: Manage users, profiles, employee IDs, and accounts.
   - **Roles (`roles`)**: Manage roles (e.g. PM, TL, BA, QA, DEV, FE, BE, DESIGNER).
   - **Role Rates (`role-rates`)**: Set up daily manday rates per role for Project work vs Support work (`ratePerMandayProject` and `ratePerMandaySupport`).
   - **Master Projects (`project`)**: The central catalog of project definitions (`master_projects` table).
3. **Projects (`projects`)**: Concrete instances of projects linked to a master project, including member assignments (`project_members`), and support for sub-projects/parent-child project hierarchies.
4. **Project Activities (`project-activities`)**: Task backlogs, milestones, and task assignments for projects, which directly feed into the billing calculations.
5. **Purchase Orders (`purchase-orders` & `po-members`)**:
   - Manage Purchase Orders (POs) and associate multiple projects (`po_projects` junction) with allocated mandays.
   - Link project members to POs (`po_members` table) with actual mandays, billable status, and custom rates.
6. **Support Tickets (`support-tickets`)**:
   - Ticket reporting against master projects, and multiple assignees (`support_ticket_assignees`) with specific role-based hours spent.
7. **Billing (`billing`)**:
   - Generate dynamic previews and billing records (invoices) based on actual mandays logged via project activities or support tickets.

---

## 📊 Database Schema (TypeORM Entities)

The database model is structured as follows:

```
users <--> user_roles <--> roles
                             ^
                             |
                         role_rates (Project vs Support Daily Rates)

master_projects <---- projects (Hierarchy: Parent-Child)
    ^                    |
    |                    |---> project_members <---- users + roles
    |                    |---> project_activities <---- users
    |                    |
    |---- support_tickets <--- support_ticket_assignees <---- users + roles
                           
purchase_orders <== (po_projects) ==> projects
    |
    +---> po_members <---- project_members + roles

billings <== (billing_projects) ==> projects
    |
    +---> billing_details <---- projects + roles
```

### 1. Core Master Data Tables
- **`users`**: User profiles with columns: `id`, `email`, `password_hash`, `full_name`, `employee_id`, `avatar_url`, `is_active`, and audit columns (`created_at`, `updated_at`, `deleted_at`).
- **`roles`**: Standard role definitions (e.g. `PM`, `TL`, `BA`, `QA`, `DEV`, `FE`, `BE`, `DESIGNER`).
- **`user_roles`**: Many-to-many junction mapping users to their roles.
- **`role_rates`**: Standard rates per role for Project work vs Support work:
  - `rate_per_manday_project` (decimal 12,2)
  - `rate_per_manday_support` (decimal 12,2)
- **`master_projects`**: Root project definitions. Contains `project_code`, `name`, `description`, `platform`, `is_active`.

### 2. Project Instance & Activities Tables
- **`projects`**: Instances of projects. Links to `master_projects` via `project_id`. Tracks `pic_client`, `customer`, `pic_internal`, `parent_project_id`, `status` (`ProjectStatus` enum), `total_mandays`, dates, and `progress_pct`.
- **`project_members`**: Group members assigned to projects with `assigned_mandays` and `actual_mandays`.
- **`project_activities`**: Tasks/backlogs of projects. Tracks `activity_name`, `phase` (enum: FCAB, REQUIREMENT, DEVELOPMENT, SIT, UAT, FUT, etc.), `duration_days`, `mandays`, dates, `progress_pct`, `is_milestone`, and assignee (`assigned_to`).

### 3. Support Tickets Tables
- **`support_tickets`**: Tracks issues/support work against a `master_project_id`. Columns: `ticket_code`, `customer`, `pic_client`, `issue_title`, `issue_description`, `hours_spent`, `mandays_spent`, `status` (`SupportTicketStatus` enum), and dates.
- **`support_ticket_assignees`**: Many-to-many mapping for ticket assignees, tracking role, `hours_spent`, and status (`SupportTicketDetailStatus` enum) per assignee.

### 4. Purchase Order Tables
- **`purchase_orders`**: Tracks clients' PO details: `po_number`, `po_name`, `customer`, `total_mandays`, `total_amount`, and `status` (`PurchaseOrderStatus` enum).
- **`po_projects`**: Junction table assigning projects to a PO with `allocated_mandays`.
- **`po_members`**: Assigns project members to a PO, tracking `actual_mandays`, `actual_hours`, custom `rate_per_manday`, `total_cost`, and `is_billable`.

### 5. Billing Tables
- **`billings`**: Billing records containing `billing_number`, `billing_period_start`, `billing_period_end`, `total_mandays`, `total_amount`, `status` (`BillingStatus` enum), `billing_type` (`PROJECT` or `SUPPORT`).
- **`billing_projects`**: Junction table linking billings to their respective projects.
- **`billing_details`**: Breakdown of billing items by project and role, storing `mandays`, `rate_per_manday`, and `subtotal`.

---

## 🧮 Auto-Code & Numbering Formats

The application automatically generates sequential codes for records:
- **Master Projects**: `HCM-YYYY-NNN` (e.g. `HCM-2026-001`)
- **Purchase Orders**: `PO-HCM-YYYY-NNN` (e.g. `PO-HCM-2026-001`)
- **Billing Records**: `BILL-YYYYMM-NNN` (e.g. `BILL-202605-001`)

---

## 💰 Billing Calculation Engine

Billing is calculated dynamically depending on `billingType`:
1. **PROJECT Billing**:
   - Calculates total actual mandays logged in `project_activities` for the selected projects during the billing period.
   - For each project member, it sums the `mandays` from activities matching their `userId` where the activity's `startDate` lies in the range.
   - The rate is fetched from the standard `role_rates` table. If the project has a `parentProjectId !== null` (i.e. it is a sub/support project instance), it applies `ratePerMandaySupport`; otherwise, it applies `ratePerMandayProject`.
2. **SUPPORT Billing**:
   - Calculates actual mandays from support tickets assignee logs: `mandays = hoursSpent / 8`.
   - The rate applied is always the role's `ratePerMandaySupport`.

---

## 🔌 API Endpoints Reference

All endpoints are prefixed with `/api`. Interactive OpenAPI/Swagger documentation is available at `/api/docs`.

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to get JWT
- `GET /api/auth/me` - Get current logged-in user profile
- `POST /api/auth/change-password` - Change account password

### Users (`/api/users`)
- `GET /api/users` - List all users (paginated)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (soft delete)

### Roles (`/api/roles`)
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by id
- `POST /api/roles` - Create a new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Role Rates (`/api/role-rates`)
- `GET /api/role-rates` - List all role rates (paginated)
- `GET /api/role-rates/global` - Get active global role rates
- `GET /api/role-rates/:id` - Get role rate by id
- `POST /api/role-rates` - Create role rate
- `PUT /api/role-rates/:id` - Update role rate
- `DELETE /api/role-rates/:id` - Delete role rate

### Master Projects (`/api/master/projects`)
- `GET /api/master/projects` - Get master projects list (paginated)
- `GET /api/master/projects/:id` - Get master project details
- `POST /api/master/projects` - Create master project definition
- `PUT /api/master/projects/:id` - Update master project definition
- `DELETE /api/master/projects/:id` - Soft remove master project

### Projects & Members (`/api/projects`)
- `GET /api/projects` - Get all project instances (paginated)
- `GET /api/projects/:id` - Get project instance details
- `POST /api/projects` - Create project instance
- `PUT /api/projects/:id` - Update project instance
- `DELETE /api/projects/:id` - Delete project instance
- `GET /api/projects/:id/members` - Get project members list
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:memberId` - Remove member from project

### Project Activities (`/api/project-activities`)
- `GET /api/project-activities/project/:projectId` - Get activities for a project
- `GET /api/project-activities/:id` - Get activity details
- `POST /api/project-activities` - Create activity
- `PUT /api/project-activities/:id` - Update activity
- `PATCH /api/project-activities/:id/progress` - Quick update progress percentage
- `DELETE /api/project-activities/:id` - Delete activity

### Purchase Orders (`/api/purchase-orders`)
- `GET /api/purchase-orders` - List POs (paginated)
- `GET /api/purchase-orders/without-po` - Get active projects not assigned to any PO
- `GET /api/purchase-orders/:id` - Get PO details
- `GET /api/purchase-orders/project/:projectId` - Get POs containing a project
- `POST /api/purchase-orders` - Create a new PO
- `POST /api/purchase-orders/:id/projects` - Assign project to PO
- `DELETE /api/purchase-orders/:id/projects/:projectId` - Remove project from PO
- `PUT /api/purchase-orders/:id` - Update PO details
- `DELETE /api/purchase-orders/:id` - Delete PO

### PO Members (`/api/po-members`)
- `GET /api/po-members/po/:poId` - Get members assigned to a PO
- `POST /api/po-members` - Assign a project member to a PO
- `PUT /api/po-members/:id/actuals` - Update member's actual mandays for the PO
- `DELETE /api/po-members/:id` - Remove member from PO

### Support Tickets (`/api/support-tickets`)
- `GET /api/support-tickets` - List support tickets (paginated)
- `GET /api/support-tickets/:id` - Get ticket details
- `POST /api/support-tickets` - Create a support ticket
- `PUT /api/support-tickets/:id` - Update ticket details
- `DELETE /api/support-tickets/:id` - Delete ticket
- `GET /api/support-tickets/:id/assignees` - Get assignees of a ticket
- `POST /api/support-tickets/:id/assignees` - Assign user to ticket
- `PUT /api/support-tickets/:id/assignees/:assigneeId` - Update assignee hours/status
- `DELETE /api/support-tickets/:id/assignees/:assigneeId` - Remove assignee from ticket

### Billing Invoices (`/api/billing`)
- `POST /api/billing/preview` - Generate a preview breakdown of billing calculation
- `POST /api/billing` - Create and finalize a billing record (invoice)
- `GET /api/billing` - List all billing records
- `GET /api/billing/:id` - Get billing details & breakdown
- `DELETE /api/billing/:id` - Delete a billing record

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0)

### 1. Setup Environment
Create a `.env` file in the root directory (based on project configurations):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=project_management
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1h
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Database Seeding
To populate the database with initial master data (roles, users, rates, projects, purchase orders) and support tickets:
```bash
# Seed Master Projects, Users, Project Instances, and POs
npm run seed

# Seed Support Tickets and Support Ticket Assignees
npm run seed:support
```

### 4. Running the App
```bash
# Development mode
npm run start:dev

# Production build & start
npm run build
npm run start:prod
```

Once running, you can explore and test the endpoints using the **Swagger UI** at:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**
