# Concept Note
## VisionLog: Integrated Fleet Management & Smart Driver Digital Log Application for World Vision Zambia

### 1. Background and Problem Statement

World Vision Zambia (WVZ) operates a large, mission-critical fleet that supports staff movements, logistics, and field operations. Many processes—vehicle bookings, trip logs, inspections, license checks, and financial tracking—are still handled using paper forms, Excel sheets, emails, and fragmented manual reporting. This creates:

- **Limited real-time visibility** of where vehicles are, how they are used, and by whom
- **Weak enforcement of compliance requirements** such as license validity, pre-trip inspections, and hours-of-service limits
- **Difficulty linking fleet costs** to projects and cost centres for accountability and donor reporting
- **Time-consuming reconciliation** between fleet data and finance/ERP systems

The **WVZ App Challenge** calls for an Integrated Fleet Management & Smart Driver Digital Log Application that digitizes bookings, trip logs, inspections, and compliance, with clear dashboards and role-based access.

### 2. Overall Solution Concept (Describing the Solution)

#### 2.1 Solution Overview

**VisionLog** is a mobile-first, enterprise-grade fleet management platform with a complementary web administration portal. It provides:
- A **mobile application** for drivers and staff to book vehicles, log trips, perform inspections, and submit receipts
- A **web/administrative portal** for fleet managers, supervisors, finance officers, and compliance teams to approve requests, manage vehicles, monitor violations, and generate reports

The system is designed to:
- Digitize and centralize vehicle bookings, mileage logs, digital inspections, and incident reporting
- Provide role-based access and approval workflows aligned with reporting hierarchies
- Link every trip and cost to cost centres/projects for accountability
- Offer dashboards and exportable Excel/CSV reports for operational, financial, and compliance analysis

#### 2.2 Key User Roles

| Role | Responsibilities |
|------|------------------|
| **Drivers** | Book vehicles, log trips, conduct inspections, upload receipts, view violation points |
| **Non-driver staff** | Request transport, link trips to cost centres, request a driver |
| **Supervisors/Line managers** | Approve trip requests from staff who report to them |
| **Fleet managers/Administrators** | Manage vehicles, schedules, maintenance, and policies |
| **Finance officers** | Analyse fuel and maintenance spend, cost-per-trip, and cost-per-cost-centre |
| **Compliance/HR** | Track licenses, incidents, violation points, and safety metrics |

### 3. Core Functional Modules

#### 3.1 Mobile Application 

**1. Secure Login & Profile**
- Login via email/username and password, protected by Two-Factor Authentication (2FA) using SMS/Email OTP or authenticator app.
- Each user profile stores organizational data, including department, role, and a `reports_to` field so the system automatically knows who their supervisor is.

**2. Vehicle Booking & Trip Logging**
- Create trip requests with origin, destination, trip purpose, cost centre/project, passengers, and expected time.
- Supervisor receives an in-app notification to approve or reject based on the `reports_to` relationship.
- Once approved and a vehicle/driver is assigned, the driver can:
    - **Start trip** → system records start mileage, location, timestamp
    - **End trip** → system records end mileage, route summary, passengers, and duration
- Calculated mileage, time, and fuel/expense data are stored for analysis and export.

**3. Digital Inspections**
- Mandatory pre-trip and post-trip checklists tailored to vehicle type (tyres, brakes, lights, fluids, safety kit, etc.).
- Photo/video uploads for damage and incident evidence.
- Critical findings automatically trigger maintenance tickets and may block further bookings.

**4. Receipts & Incident Capture**
- In-app capture of fuel, toll, and repair receipts with photo and amount.
- Incident logging (accidents, breakdowns, traffic offences) linked to driver and trip.

**5. Offline Mode**
- Trips and inspections can be captured offline, then synced when connectivity is restored—important for rural operations.

#### 3.2 Web Administration & Workflow

**1. Booking & Approval Workflow**
- Web dashboard listing pending requests.
- Supervisor sees requests only from staff that report to them (based on the reporting hierarchy).
- Fleet manager can allocate vehicles and drivers, resolve conflicts, and monitor usage.

**2. Fleet & Maintenance Management**
- Vehicle master data (make, model, registration, insurance, fitness, road tax, fuel type).
- Maintenance scheduling based on time or mileage thresholds.
- License, insurance, and road-tax reminders.

**3. Finance & Compliance Workspace**
- View fuel spend, maintenance costs, and trip expenses by vehicle, driver, department, or project.
- Export tables and pivot-style summaries to Excel/CSV for further analysis, donor reporting, or ERP integration.

**4. Dashboards & Reporting**
- Visual dashboards for utilization, active bookings, overdue returns, violations, and cost trends.
- Standard and ad-hoc reports, all exportable (Excel, CSV, PDF).

### 4. Security, Compliance, and Enterprise-Grade Design

**1. Authentication & Two-Factor Authentication**
- Username/password plus 2FA via OTP (SMS/Email) or TOTP authenticator.
- Optional biometric unlock (fingerprint/FaceID) on mobile.

**2. Authorization & Role-Based Access Control (RBAC)**
- Fine-grained roles (Driver, Staff, Supervisor, Fleet Manager, Finance, Compliance, Admin).
- Access to data (vehicles, trips, reports) controlled by role and organizational unit.

**3. Transport & Data Security (HTTP/HTTPS)**
- All APIs exposed as RESTful HTTPS endpoints using verbs like GET, POST, PUT, DELETE.
- Encrypted in transit with TLS 1.2+ and at rest with strong encryption (e.g., AES-256) on the database level.

### 5. Database and Data Model

#### 5.1 Database Used
- **Primary database**: Relational DB such as PostgreSQL chosen for ACID compliance, robustness, and broad support.
- **Analytical/reporting layer**: Reporting schema optimized for dashboards and Excel exports.

#### 5.2 Key Entities
- **User** (with role, department, reports_to)
- **Vehicle** (registration, type, status, insurance, road tax, fitness)
- **Booking** (requestor, supervisor, vehicle, driver, cost centre, project)
- **TripLog** (start/end mileage, locations, timestamps, passengers)
- **Inspection** and **InspectionItem**
- **Expense** (fuel, toll, maintenance linked to trip and cost centre)
- **Violation** and **ViolationPoints**

Data is periodically summarized and consolidated into Excel/CSV reports for use by Finance and management.

### 6. Tech Stack
- **Web portal**: Built with React.js (Next.js)
- **Backend API**: Built with Django REST Framework (or Next.js API Routes as per current impl)
- **Database**: PostgreSQL (Supabase) – for structured storage
- **Cloud hosting**: Vercel, Render, AWS, or Azure
- **Authentication**: JWT + optional MFA (Supabase Auth)
- **Integrations**: 
    - Microsoft Outlook/Google Calendar
    - ERP/Accounting systems through API adapters

### 7. Data Migration Strategy

**1. Assessment & Mapping**
   - Inventory current data sources: paper logbooks, Excel files, and any legacy systems.
   - Define mapping from legacy columns (vehicle, date, driver, distance, fuel) to the new schema.

**2. Data Cleaning & Transformation**
   - Standardize vehicle IDs, driver IDs, cost centres, and date formats.
   - De-duplicate trips and harmonize inconsistent naming.

**3. Migration Execution**
   - Develop ETL scripts (Python/SQL) to load legacy data into staging tables, validate, then insert into production tables.
   - Conduct trial migrations in a test environment before final cut-over.

**4. Post-Migration Validation**
   - Parallel-run comparisons between old Excel reports and VisionLog outputs for a defined period.
   - Sign-off from Finance and Fleet Management.

### 8. Deliverable: Concept Design & Working Prototype (Mobile/Web)

**Scope of the Prototype (MVP)**
- **Core mobile features**: secure login with 2FA, basic vehicle booking, trip start/stop with mileage, simple inspection checklist, and receipt upload.
- **Core web/admin features**: viewing and approving requests, assigning vehicles/drivers, viewing basic dashboards and Excel exports.

**Hosted Prototype Links**
- [https://wvz.vercel.app/](https://wvz.vercel.app/) - Root page (redirects to mobile home)

---

## Implementation Roadmap (8 Weeks) 

**Week 1–2: Discovery & UI/UX**
- Requirements refinement.
- User journeys for drivers, staff, fleet managers, and finance.
- Wireframes and prototype designs.

**Week 3–4: Backend & Database**
- Setup API (Django/Next.js).
- Build models for vehicles, drivers, trips, inspections, etc.
- Implement authentication and role-based access.

**Week 5–6: Mobile & Web Development**
- Build driver and staff mobile screens.
- Admin dashboard for web.
- Implement trip workflows and inspection forms.

**Week 7: Integrations & Testing**
- Push notifications.
- File uploads (photos/videos).
- Basic analytics dashboards.

**Week 8: Finalization**
- Prepare pitch demo.
- Polish UI.
- Documentation.
- Deployment to cloud hosting.

> **Note**: The full Implementation Roadmap is in `DESIGN APPROACH & IMPLEMENTATION ROADMAP`.
