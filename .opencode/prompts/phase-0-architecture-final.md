# Phase 0 — Final Revised Home Healthcare Platform Architecture

## Executive Summary

This document presents the final Phase 0 architecture for a production-quality Home Healthcare Platform. The architecture follows a **modular monolith** pattern with a single repository containing a frontend (Next.js App Router) and backend (Node.js + Express + TypeScript) application. PostgreSQL serves as the transactional source of truth. The design prioritizes robustness, simplicity, readability, maintainability, security, testability, accessibility, performance, and appropriate scalability while explicitly avoiding unnecessary complexity, premature infrastructure choices, and duplicate implementations.

The architecture is intentionally designed to be the **simplest robust architecture** for the actual requirements, not the most elaborate. All major decisions clearly state the decision, reason, what was rejected, and what is deferred to Phase 1.

---

## Confirmed Requirements

- Home healthcare platform with four delivery layers: public website, customer portal, staff portal, and admin/operations portal.
- Core business workflow: service discovery → service selection → address → availability → appointment selection → booking → staff assignment → staff acceptance → visit progress → completion.
- Four user roles with distinct responsibilities: Customer, Staff, Admin, and unified identity authentication.
- PostgreSQL as the transactional source of truth for all business data.
- WCAG 2.2 AA accessibility target.
- OWASP ASVS security baseline.
- Versioned REST API at /api/v1/...
- Validation at system boundaries for untrusted data.
- Audit logging that is append-only and protects sensitive information.
- SEO-ready public pages with meaningful content.
- No premature adoption of Redis, JWT hybrid auth, application-layer encryption of all PII, microservices, or package-per-domain structure.

---

## Architectural Recommendations

- **Modular monolith** with domain modules inside `apps/api/src/modules/` — not one package per business domain.
- **Next.js App Router** as the frontend rendering strategy — App Router vs Pages Router is not open.
- **PostgreSQL** as the transactional source of truth — no Redis in the initial architecture.
- **Role-aware authorization** as part of the unified identity architecture — exact authentication mechanism (session-based, JWT, hybrid) deferred to Phase 1 after evaluating deployment model, browser/client requirements, security model, session lifecycle, and revocation requirements.
- **PostgreSQL transactions and constraints** for booking concurrency — no pg_trgm for temporal overlap protection, no Redis locks unless PostgreSQL is insufficient.
- **Append-only audit logs** with sensitive information protected — only actor, action, resource, timestamp, reason, and safe metadata stored.
- **WCAG 2.2 AA** accessibility designed from the beginning, not retrofitted.
- **Versioned REST API** (/api/v1/...) with consistent error format, pagination, filtering, and sorting.
- **Shared validation strategy** at system boundaries — library choice (Zod or similar) deferred to Phase 1 after dependency verification.
- **Data minimization** — only collect and expose information required for operation; treat all customer/healthcare information as sensitive.
- **Structured logging** (JSON format) with request/correlation IDs — sensitive data never exposed.
- **SEO** per public page with metadata, Open Graph, canonical URLs, and sitemap.
- **Controllers remain thin** — business rules in application/domain modules.
- **Deep modules** — small interface hiding substantial coherent behavior; avoid shallow modules that merely forward calls.
- **No unnecessary layers, files, packages, abstractions, wrappers, or infrastructure** — each addition must demonstrate real responsibility.

---

## Assumptions

- PostgreSQL can handle booking concurrency with transactions and appropriate constraints.
- The currently supported Node.js LTS version compatible with the selected Next.js version will be used and pinned during Phase 1.
- Compliance requirements (HIPAA, GDPR, PCI-DSS, etc.) are business/legal decisions, not architecturally assumed. The architecture is privacy- and security-ready through data minimization, least privilege, TLS, and auditability.
- TLS is provided by deployment infrastructure (not handled at the application level).
- One supported browser version path plus mobile browsers.
- Single team initially maintaining the modular monolith.
- TLS provides encryption in transit; encryption at rest is selective and justified, not applied to every PII field automatically.
- The deployment model will support a single deployable unit (the modular monolith).
- Background email/WhatsApp/notification work is opted-in and opted-in communications only.
- One team initially; multi-tenant considerations are open for future evaluation.

---

## Open Decisions

- **Exact authentication mechanism** — session-based vs JWT evolution vs hybrid; to be finalized in Phase 1 after evaluating deployment model, browser/client requirements, security model, session lifecycle, and revocation requirements.
- **Specific database isolation level** — SERIALIZABLE vs REPEATABLE READ vs Read Committed; to be selected after the scheduling model is finalized.
- **Booking concurrency enforcement mechanism** — exact PostgreSQL constraints (exclusion constraints, unique constraints on time slots, check constraints) after the scheduling data model is finalized.
- **Selective field-level encryption for PII at rest** — whether and which fields require application-layer encryption beyond TLS and database-level encryption; to be evaluated after data access patterns and compliance requirements are understood.
- **Background job queue provider** — if and when background jobs (email, WhatsApp, notifications) are needed, provider selection deferred to Phase 1.
- **Detailed API versioning and deprecation strategy** — beyond v1 boundaries; to be clarified during API design in Phase 1.
- **Compliance implementation details** — HIPAA, GDPR, or other regime-specific controls; marked as business/legal decisions.
- **Redis need** — whether any concrete requirement during Phase 1 proves PostgreSQL insufficient for caching, rate limiting, or temporary state.
- **Precise password reset token architecture** — token format, storage, revocation mechanism.
- **Multi-tenant considerations** — if required later, design implications.
- **Exact audit log schema beyond append-only baseline** — specific fields and metadata after concrete requirements are identified.

---

## Phase 1 Decisions

- Concrete authentication mechanism (session-based token format, JWT usage, refresh/access flow).
- Precise PostgreSQL isolation level for booking concurrency.
- Exact scheduling data model and temporal overlap constraints.
- Background job queue provider and infrastructure.
- Detailed audit log schema beyond the append-only baseline.
- Selective field-level encryption for PII at rest, if any.
- Exact API versioning, deprecation, and beyond-v1 structure.
- Compliance implementation details based on finalized regulatory/legal decisions.
- Redis introduction if and only if a concrete requirement proves PostgreSQL insufficient.
- Package extraction strategy if/when domains genuinely justify separate packages.

---

## Product Understanding

The platform is a home healthcare system serving four user constituencies with distinct workflows:

1. **Public website** — healthcare service discovery and business information. Priorities: SEO, accessibility, performance, responsive/mobile-first design, trustworthy visual hierarchy, meaningful content. Areas: home, services, individual service pages, about, contact, locations, FAQs.

2. **Customer portal** — authenticated customers managing their healthcare journey. Features: profile management, addresses, service browsing, service selection, appointment selection, booking creation, booking history, booking status, appropriate booking actions, relevant notifications.

3. **Staff portal** — authenticated staff managing assigned work. Features: view assigned work, view schedules/availability, manage availability where authorized, accept/manage assignments, update booking/visit status, view information necessary to perform assigned work.

4. **Admin / operations portal** — authenticated administrators managing the healthcare operation. Features: manage customers, manage staff, manage services, manage bookings, assign staff, manage leads, monitor operations, manage configuration, review audit information, view operational reporting.

The core booking workflow flows: service discovery → service selection → address → availability → appointment selection → booking → staff assignment → staff acceptance → visit progress → completion. Rescheduling is an auditable action/history, not automatically a booking lifecycle state transition. Cancellation, failed bookings, unavailable staff/slots, concurrent booking attempts, notification failure, and staff reassignment are all analyzed business paths.

---

## Users and Roles

| Role | Authentication | Primary Responsibilities |
|---|---|---|
| **Customer** | Unified system, role-aware | Own profile, own addresses, own bookings; browse services; select services; select appointment times; create bookings; view booking history and status; manage appropriate booking actions |
| **Staff** | Unified system, role-aware | View assigned work; view schedules and availability; manage availability where authorized; accept/manage assignments; update booking/visit status; view information necessary to perform assigned work |
| **Admin** | Unified system, role-aware | Manage customers; manage staff; manage services; manage bookings; assign staff; manage leads; monitor operations; manage configuration; review audit information; view operational reporting |

**Authorization model:**
- Authentication identifies the user; authorization determines what the user may access.
- Least privilege: users can only access resources they own or are explicitly authorized for.
- Role-based access control combined with resource-level authorization checks.
- Never assume authentication = authorization.
- Customer can access own resources; staff can access assigned resources; admin can access all within defined permissions.
- Resource-level authorization enforced at API route level, not duplicated in every handler.

---

## Core Business Workflows

### Customer Workflow
1. Service discovery (browse/list services on public website or customer portal)
2. Service selection
3. Address selection/management
4. Availability check
5. Appointment selection
6. Booking creation
7. Staff assignment
8. Staff acceptance
9. Visit progress updates
10. Completion
- Failure paths: invalid input, unavailable slot, concurrent booking, failed assignment, staff rejection, cancellation, rescheduling

### Staff Workflow
1. Authentication
2. View assigned work (today's/upcoming assignments)
3. View schedules and availability
4. Manage availability where authorized
5. Accept/manage assignments
6. Update booking/visit status
7. View necessary information to perform assigned work
- Failure paths: unauthorized access, no assignments, availability conflicts

### Admin Workflow
1. Authentication
2. Manage customers (CRUD, search, filter)
3. Manage staff (CRUD, availability, assignments)
4. Manage services (CRUD, categories, pricing)
5. Manage bookings (view, status changes, assignments)
6. Assign staff to bookings
7. Manage leads
8. Monitor operations (operational KPIs, alerts)
9. Review audit information
10. Manage appropriate configuration
- Failure paths: unauthorized access, data inconsistency, configuration errors

---

## Architecture Overview

The system is a **modular monolith** with a single repository containing two primary applications and several shared packages:

- **apps/web** — Next.js frontend (App Router, React, TypeScript)
- **apps/api** — Node.js + Express + TypeScript modular monolith
- **packages/ui** — shared UI components and design system
- **packages/validation** — shared validation schemas and utilities
- **packages/config** — shared configuration and environment handling
- **packages/types** — shared TypeScript types and interfaces

Business domains remain as **modules inside `apps/api/src/modules/`** — not extracted as separate packages unless a future demonstrated requirement justifies it. Each module owns a cohesive business capability and may contain routes, controllers, application/use-case logic, domain logic, validation, and types — but only when those represent real responsibilities.

**Dependency direction:** toward stable business concepts. Business/domain logic must not depend on HTTP frameworks, Express request/response objects, database implementation details, browser APIs, or UI components. Framework-specific concerns belong at the edges. No circular dependencies.

---

## Repository Structure

```
/
├── apps/
│   ├── web/          ← Next.js App Router frontend
│   └── api/          ← Node.js + Express modular monolith backend
├── packages/
│   ├── ui/           ← shared UI components and design system
│   ├── validation/   ← shared validation schemas
│   ├── config/       ← shared configuration and env handling
│   └── types/        ← shared TypeScript types and interfaces
├── .opencode/        ← opencode skills and prompts
└── AGENTS.md        ← project constitution
```

**Module ownership:** Business domains live inside `apps/api/src/modules/` as cohesive modules (e.g., `authentication`, `customers`, `staff`, `services`, `addresses`, `bookings`, `leads`, `notifications`, `administration`). Modules are **not** packages in `packages/`. Package-per-domain is explicitly avoided; packages contain genuinely shared functionality across domains (UI components, validation strategies, configuration, types).

Each module has **one authoritative owner** — the domain it belongs to. No duplicate business logic across modules. If behavior is shared meaningfully across domains, it moves to a package; otherwise, it stays within the owning module.

---

## Backend Modular Monolith

The backend is a **Node.js + Express + TypeScript** modular monolith. Organization is by **business domain**, not by arbitrary technical layers.

### Module responsibilities (per domain, only when real):

Each module may own a subset of these layers, only when they represent meaningful responsibility:

- **Routes** — Express route definitions specific to the domain
- **Controllers** — thin handlers that delegate to application logic; remain minimal
- **Application/use-case logic** — orchestration of operations; business rule enforcement
- **Domain/business rules** — pure business logic, independent of framework and database
- **Validation** — input validation at the system boundary (API layer)
- **Persistence/data access** — database operations, repository pattern or direct query building within transactions
- **Types** — TypeScript types specific to the domain

### Key principles:

- **Controllers remain thin** — they authenticate, authorize, validate input, and delegate; no business rules in controllers.
- **Business rules have one authoritative owner** — each rule lives in exactly one module.
- **Infrastructure concerns do not leak throughout business logic** — database types, query builders, etc. stay in persistence-adjacent code; domain logic uses plain types or well-defined interfaces.
- **Deep modules** — a small, understandable interface hides substantial coherent behavior behind it. Avoid shallow modules that merely forward calls between files.
- **No forced identical layers** — not every module contains every layer. A layer exists only when it represents a real responsibility.
- **Module dependency flow:** UI → API client → backend modules → domain logic → PostgreSQL. No framework-specific types leak into business logic.

### Module examples (conceptual, not mandatory):

- `authentication/` — unified identity, password handling, session management, role assignment
- `customers/` — customer profile, addresses, one-to-one with users
- `staff/` — staff profiles, specializations, availability
- `services/` — service catalog, categories, pricing, active/inactive status
- `addresses/` — customer and staff addresses, types (home, work, etc.)
- `bookings/` — core booking lifecycle, status transitions, assignments, audit integration
- `leads/` — lead tracking, source, status, conversion
- `notifications/` — notification preferences, types, dispatch integration
- `administration/` — configuration, user management (role-based), operational reporting

---

## Frontend Architecture

The frontend uses **Next.js App Router** with **React** and **TypeScript**. The app router decision is explicit — not left open.

### Structure:

- `app/` — Next.js App Router routes
- `components/` — React components (shared UI, portal pages)
- `lib/` — utilities, API clients, formatting functions
- `styles/` — global styles, CSS variables, theming

### Route groups (public website vs portals):

- **Public website** — service discovery, business information; no authentication required
- **Customer portal** — authenticated routes; profile, addresses, services, bookings, history
- **Staff portal** — authenticated routes; assigned work, schedules, availability
- **Admin portal** — authenticated routes; customers, staff, services, bookings, leads, operations

### Key patterns:

- **Next.js server components** where data fetching and rendering are appropriate; **client components** for interactivity and state.
- **Server Component API clients** fetch data from `/api/v1/...` endpoints; no direct database access from the frontend.
- **Form handling** with validation at the boundary; validation schemas shared between frontend and backend where appropriate.
- **Error/loading/empty states** considered from the start for all user flows.
- **Accessibility (WCAG 2.2 AA)** — semantic HTML, proper labels, focus management, screen-reader semantics, accessible forms and dialogs, color contrast, touch targets minimum 44x44px, reduced motion support, responsive design. Built-in, not retrofitted.
- **SEO per page** — metadata (title, description, keywords), Open Graph tags, canonical URLs, sitemap inclusion, robots.txt, semantic HTML, internal linking, optimized images, Core Web Vitals consideration.
- **Responsive/mobile-first design** — all pages work well on mobile devices first, then progressively enhance for larger screens.
- **Shared UI components** for common patterns (buttons, cards, tables, forms, navigation) — not a generic AI/SaaS template.
- **No generic AI/SaaS-template UI** — the interface feels like real healthcare operations software: trustworthy, calm, professional, accessible.

### Server/Client boundaries:

- Data fetching via Server Components or API routes (`/api/v1/...`)
- Client state for form state, toggle states, non-critical UI interactions
- No sensitive data exposed to client components
- Environment variables accessed via `process.env` at build time or runtime as appropriate

---

## Domain Boundaries

Domains are **cohesive business capabilities**, not arbitrary folder splits. Each domain module owns all responsibilities required for that capability, but only when they represent real needs.

| Domain | Core Responsibilities (only when real) |
|---|---|
| **authentication** | Unified identity architecture; role-aware authorization; password handling; session management; resource-level access enforcement |
| **customers** | Customer profile; customer addresses; one-to-one relationship with users; customer search and filtering |
| **staff** | Staff profiles; specializations; availability management; assigned work filtering |
| **services** | Service catalog; categories; pricing; active/inactive status; service discovery and browsing |
| **addresses** | Customer addresses; staff addresses; type classifications (home, work); address validation |
| **bookings** | Core booking lifecycle (requested → confirmed → in_progress → completed → cancelled); status transitions; assignments; staff acceptance; rescheduling as auditable action; cancellation |
| **leads** | Lead tracking; source capture; status management; conversion tracking |
| **notifications** | Notification preferences; opted-in communications; in-app and messaging (email/WhatsApp) types; dispatch integration |
| **administration** | Configuration management; user management within role scope; operational reporting; audit information review |

**Module boundaries are flexible** — if a domain's responsibilities grow meaningfully, the module may be deepened. If multiple domains share behavior, shared functionality moves to packages. No module is created merely to increase folder count.

---

## Dependency Direction

Dependencies flow **toward stable business concepts** — away from framework and infrastructure concerns.

### Forbidden dependency directions (business/domain logic must NOT depend on):

- Express request (`req`) or response (`res`) objects
- Database implementation details (knex, sequelize, raw SQL strings beyond minimal query building)
- Browser APIs (localStorage, sessionStorage, window, document — in backend)
- UI components or presentation logic (in backend)
- HTTP framework types beyond minimal handler signatures
- Framework-specific serialization

### Permitted dependency directions:

- **UI → API client → backend modules → domain logic → PostgreSQL** — clean flow through versioned API
- **Packages → modules** — shared utilities (validation, config, types) used by modules
- **Infrastructure → application/domain contracts** — database drivers, Redis clients, etc. depend on application interfaces, not the reverse
- **Environment/configuration → application** — config values injected at startup

### Key rules:

- **No circular dependencies** — verified during planning and enforced via import reviews.
- **Avoid unnecessary dependency inversion** — interfaces only when they reduce complexity for callers or enable testing; not introduced merely because "Clean Architecture says interfaces are useful."
- **Framework-specific concerns at the edges** — Express handlers convert between framework types and domain types at the boundary; domain logic uses plain TypeScript.
- **One authoritative owner per business rule** — if multiple modules need the same rule, the rule lives in one module and is imported by others; no duplicate rule implementations.

---

## Authentication and Authorization

### Unified identity architecture

**One authentication system** serves all roles (customers, staff, admins). Separate authentication systems for each role are explicitly avoided.

### Authentication (who the user is)

- Unified system with role-based differentiation.
- **Phase 1 decision:** exact mechanism (session cookies, JWT, refresh/access token flow) evaluated after deployment model, browser/client requirements, security model, session lifecycle, and revocation requirements are understood.
- **Password security** — bcrypt or argon2 with appropriate work factor; library choice deferred to Phase 1 after dependency/version verification.
- **Password reset** — time-limited tokens; architecture documented; implementation in Phase 1.
- **Session revocation** — mechanism documented and implemented in Phase 1.

### Authorization (what the user may access)

- **Least privilege model** — users can only access resources they own or are explicitly authorized for.
- **Role-based access control (RBAC)** combined with **resource-level authorization**.
- **Authorization decisions** enforced at the API route/handler level, not duplicated in every business logic call.
- **Never assume authentication = authorization** — being authenticated does not imply access to every resource.

### Resource-level authorization examples:

- **Customer:** can access own profile (`/api/v1/customers/me`), own addresses (`/api/v1/addresses?customerId=...`), own bookings (`/api/v1/bookings?customerId=...`). Cannot access other customers' resources.
- **Staff:** can access authorized assigned work (`/api/v1/bookings?staffId=...` with proper authorization check); can update visit status for assigned bookings; cannot access bookings they are not assigned to.
- **Admin:** can access all customers, staff, services, bookings, leads within defined permissions; can manage configuration; cannot access patient-specific data beyond what is explicitly authorized.

### Authorization enforcement:

- Middleware or route guards check authentication and authorization before handler execution.
- Centralized authorization logic where possible — not duplicated across every handler.
- Denied requests return consistent `403 Forbidden` response without exposing internal details.
- Audit log entry created for authorization denial events.

---

## Booking and Scheduling

### Core conceptual flow

Service discovery → Service selection → Address → Availability → Appointment selection → Booking → Staff assignment → Staff acceptance → Visit progress → Completion

### Rescheduling

- **Rescheduling is an auditable action/history, not automatically a booking lifecycle state transition.**
- Schedule changes must be auditable — who changed it, when, why.
- The final scheduling model may determine whether rescheduling modifies the booking, creates a related appointment record, or uses another model.
- This is **not** prematurely decided in Phase 0; deferred to Phase 1 after business rule validation.

### Booking lifecycle (conceptual)

- `requested` → `confirmed` → `in_progress` → `completed` → `cancelled`
- Transitions are explicit and auditable.
- "Rescheduled" does not automatically become a permanent state — it is a business action recorded in audit log.

### Concurrency

- **PostgreSQL is the source of truth** for booking availability.
- **Do not use pg_trgm for temporal booking overlap prevention.**
- Mechanisms evaluated after scheduling model is finalized:
  - Database transactions with appropriate isolation
  - Constraints (unique constraints on time slots, exclusion constraints with GiST index)
  - Idempotency keys for booking operations
  - Application-level locking only where justified by business rules
- **Two concurrent customers must not both successfully book the same unavailable resource/time** according to business rules.
- **Simplest PostgreSQL-native mechanism** that safely guarantees the invariant is preferred.
- **Redis locks only if PostgreSQL cannot guarantee the required safety** — not assumed needed.

---

## PostgreSQL and Data Integrity

PostgreSQL is the **transactional source of truth** for all business data.

### Conceptual data model (Phase 0 — not locked to every column)

Core entities and their relationships:

| Entity | Key Fields | Relationships |
|---|---|---|
| **users** | id, name, email, password_hash, role, created_at, updated_at | → customers (1:1), → staff (1:0..1), authentication system |

| **customers** | id, user_id → users, phone, address_summary, created_at, updated_at | → users (one-to-one), → addresses (one-to-many), → bookings (one-to-many) |
| **customer_addresses** | id, customer_id, street, city, state, postal_code, type, default, created_at | → customers (many-to-one) |
| **staff** | id, user_id → users, specialization, created_at, updated_at | → users (one-to-one), → availability (one-to-many), → bookings (optional many-to-one) |
| **staff_availability** | id, staff_id, date, start_time, end_time, is_available, created_at | → staff (many-to-one) |
| **services** | id, name, description, duration, price, category, is_active, created_at, updated_at | → bookings (many-to-one) |
| **service_categories** | id, name, description, created_at, updated_at | → services (many-to-one) |
| **bookings** | id, customer_id → customers, staff_id → staff (optional), service_id → services, start_time, end_time, status, created_at, updated_at | → customers (many-to-one), → staff (optional many-to-one), → services (many-to-one), → status_history (one-to-many) |
| **booking_status_history** | id, booking_id → bookings, from_status, to_status, changed_by, changed_at, reason, created_at | → bookings (many-to-one) |
| **leads** | id, name, contact, source, status, notes, created_at, updated_at | — |
| **notifications** | id, recipient_type, recipient_id, type, content, status, created_at, sent_at | — |
| **audit_logs** | id, entity_type, entity_id, action, performed_by, reason, changes_json, created_at | — |

### Important constraints:

- **Foreign keys:** bookings → customers, bookings → staff (optional), bookings → services, booking_status_history → bookings
- **Unique constraints:** users.email (unique), customers.user_id (unique, one-to-one with users)
- **Check constraints:** bookings.start_time < bookings.end_time; staff_availability.start_time < staff_availability.end_time
- **Indexes:** bookings on (start_time, end_time) for overlap queries; bookings on customer_id; bookings on staff_id; bookings on status; users on email; customers on user_id
- **Lifecycle:** bookings have explicit status transitions; rescheduling creates new audit log entry, doesn't automatically change booking state

### Booking integrity:

- **No N+1 queries** — explicit query planning and eager loading where needed.
- **Transactions for critical operations** — booking creation, status transitions, and concurrency checks within PostgreSQL transactions.
- **Application code does not exclusively enforce critical invariants** — database constraints provide the primary integrity guarantees.

---

## Conceptual Data Model

(The following is a conceptual model at Phase 0 — exact columns, types, and constraints are NOT locked in until the scheduling data model is finalized in Phase 1.)

### users

- `id` UUID primary key
- `name` text
- `email` text UNIQUE
- `password_hash` text (bcrypt/argon2 hash)
- `role` text (customer/staff/admin)
- `email_verified` boolean default false
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone



- `id` UUID primary key
- `user_id` UUID UNIQUE REFERENCES users(id)
- `phone` text
- `address_summary` text (concatenated or referenced)
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### customer_addresses

- `id` UUID primary key
- `customer_id` UUID REFERENCES customers(id)
- `street` text
- `city` text
- `state` text
- `postal_code` text
- `type` text (home, work, etc.)
- `default` boolean
- `created_at` timestamp with time zone

### staff

- `id` UUID primary key
- `user_id` UUID UNIQUE REFERENCES users(id)
- `specialization` text (optional)
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### staff_availability

- `id` UUID primary key
- `staff_id` UUID REFERENCES staff(id)
- `date` date
- `start_time` time with time zone
- `end_time` time with time zone
- `is_available` boolean
- `created_at` timestamp with time zone

### services

- `id` UUID primary key
- `name` text
- `description` text (optional)
- `duration` integer (minutes)
- `price` decimal
- `category_id` UUID REFERENCES service_categories(id) (optional)
- `is_active` boolean default true
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### service_categories

- `id` UUID primary key
- `name` text
- `description` text (optional)
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### bookings

- `id` UUID primary key
- `customer_id` UUID REFERENCES customers(id)
- `staff_id` UUID REFERENCES staff(id) (nullable — not all bookings have assigned staff initially)
- `service_id` UUID REFERENCES services(id)
- `start_time` timestamptz
- `end_time` timestamptz
- `status` text (requested/confirmed/in_progress/completed/cancelled)
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### booking_status_history

- `id` UUID primary key
- `booking_id` UUID REFERENCES bookings(id)
- `from_status` text
- `to_status` text
- `changed_by` UUID REFERENCES users(id) (nullable — system admin, staff, customer)
- `changed_at` timestamp with time zone
- `reason` text (optional — free-form, minimized for sensitive data)
- `created_at` timestamp with time zone

### leads

- `id` UUID primary key
- `name` text
- `contact` text (email/phone)
- `source` text (website/form/referral)
- `status` text (new/contacted/qualified/converted/lost)
- `notes` text (optional)
- `created_at` timestamp with time zone
- `updated_at` timestamp with time zone

### notifications

- `id` UUID primary key
- `recipient_type` text (customer/staff/admin)
- `recipient_id` UUID (→ customers, staff, or users)
- `type` text (email, whatsapp, in_app)
- `content` text (optional — minimized for sensitive data)
- `status` text (pending, sent, delivered, failed)
- `created_at` timestamp with time zone
- `sent_at` timestamp with time zone (nullable)

### audit_logs

- `id` UUID primary key
- `entity_type` text (bookings, customers, staff, services, users, bookings_status, etc.)
- `entity_id` UUID (referenced record)
- `action` text (created, updated, status_transition, rescheduling, assignment, cancellation, login, permission_denied, etc.)
- `performed_by` UUID REFERENCES users(id) (nullable — system, anonymous, etc.)
- `reason` text (optional — minimized for sensitive PII)
- `changes_json` jsonb (optional — minimal changes, no sensitive PII unless justified)
- `created_at` timestamp with time zone

### Important constraints (summary):

- Foreign keys enforce referential integrity where applicable
- Unique constraints: users.email, customers.user_id (one-to-one)
- Check constraints: booking time range validity; availability time range validity
- Indexes on frequently queried columns: bookings(start_time, end_time), bookings(customer_id), bookings(staff_id), bookings(status), users(email)
- Audit logs are **append-only** — no UPDATE or DELETE operations permitted at the database level (enforced via permissions or triggers)
- **Sensitive information minimized** in audit_logs.reason and audit_logs.changes_json — only safe metadata stored

---

## API Architecture

### Versioned REST API

- **Base path:** `/api/v1/...`
- All API endpoints versioned under v1 for the initial implementation.
- API structure reflects domain modules — not necessarily one endpoint per module, but endpoints grouped by logical domain.

### Potential API domains:

- `GET /api/v1/auth/me` — current user profile
- `POST /api/v1/auth/login` — authentication
- `POST /api/v1/auth/logout` — session termination
- `GET /api/v1/customers` — listing with pagination/filtering
- `GET /api/v1/customers/:id` — customer profile
- `PATCH /api/v1/customers/me` — profile update (own resource only)

- `GET /api/v1/services` — service catalog listing
- `GET /api/v1/services/:id` — service details

- `GET /api/v1/bookings` — listing with pagination, filtering, sorting
- `GET /api/v1/bookings/:id` — booking details
- `POST /api/v1/bookings` — create new booking
- `PATCH /api/v1/bookings/:id` — status update or rescheduling (auditable action; exact API representation finalized in Phase 1)

- `GET /api/v1/staff` — staff listing (admin only)
- `GET /api/v1/staff/:id` — staff profile

- `GET /api/v1/leads` — lead listing (admin only)
- `POST /api/v1/leads` — lead creation

### API architecture requirements:

1. **Validate input** — request bodies, query parameters, path parameters at the boundary.
2. **Authenticate where required** — middleware checks authentication before handler execution.
3. **Authorize the requested operation** — resource-level authorization per route.
4. **Execute business logic** — delegated to appropriate domain module.
5. **Return consistent responses** — standardized success/error format.
6. **Handle expected errors explicitly** — business validation errors, not generic exceptions.
7. **Avoid leaking internal database structures** — API contract is not the schema.

### Error format (consistent across API):

```json
{
  "error": {
    "code": "ERR_VALIDATION_FAILED" | "ERR_AUTHORIZATION_DENIED" | "ERR_NOT_FOUND" | "ERR_CONFLICT" | etc.",
    "message": "Human-readable description",
    "details": [...] // optional field-specific errors
    "requestId": "... correlation ID"
  }
}
```

### Pagination, filtering, sorting:

- Applied where applicable (list endpoints).
- Cursor-based or offset-based pagination as appropriate per domain.
- Filtering by active status, date ranges, etc.
- Sorting by created_at, start_time, etc.

### API documentation:

- Maintained as code is developed; tooling (OpenAPI/Swagger) evaluated in Phase 1.
- Documentation reflects actual behavior, not just specifications.

---

## Security Architecture

### OWASP ASVS baseline

The system follows OWASP Application Security Verification Standard (ASVS) as the security baseline.

### Authentication security

- Password hashing with bcrypt or argon2 (work factor chosen appropriately for the environment).
- Session management with secure, HttpOnly, Secure cookies.
- Session revocation mechanism.
- Password reset with time-limited, single-use tokens.
- Brute-force protection (rate limiting on authentication endpoints, evaluated after real patterns understood).

### Authorization security

- Least privilege model enforced at every route handler.
- Resource-level authorization checks — not assuming role = full access.
- Authorization decisions logged audibly.
- Denied access returns 403 without exposing internal details.

### Input validation and injection prevention

- All untrusted data validated at system boundaries (API layer).
- Parameterized queries — never string-concatenate SQL.
- Input length limits and pattern validation where appropriate.
- XSS prevention — output encoding, Content Security Policy headers.
- CSRF protection where applicable (Next.js App Router provides some protection; evaluated for API routes).

### Secure headers

- **Helmet** not prematurely locked in Phase 0 — evaluated during implementation after dependency verification.
- Secure headers added at the Express middleware level as appropriate:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` or `SAMEORIGIN`
  - `X-XSS-Protection` (legacy, still reasonable)
  - `Referrer-Policy`
  - `Content-Security-Policy` — tailored to the application, not generic defaults.

### Secrets management

- **Never hardcode credentials, tokens, or secrets.**
- Environment variables for all secrets.
- Secret injection at deployment, not in source code.
- .env files git-ignored; never committed.

### Sensitive data exposure prevention

- **Never** expose sensitive information in:
  - Logs (JSON format, sanitized)
  - URLs (query parameters, path parameters)
  - Analytics or telemetry
  - Error messages returned to clients
  - Debug output
  - Source control / history
- Data minimization — only expose information required for the operation.
- Audit logs protect sensitive PII — reason and changes_json fields minimized.

### Dependency security

- Regular vulnerability scanning.
- No speculative dependencies installed (KISS/YAGNI).
- Before adding any package: check existing stack, evaluate small implementation alternative, assess maintenance/security/license impact.
- Multiple libraries solving the same problem avoided.

### Access control

- Least privilege — users access only what they own/explicitly authorized for.
- Authentication ≠ authorization — explicit checks at every boundary.
- Session management with revocation capability.
- Role-based access combined with resource-level checks.

### Error handling for security

- Errors explicit and useful — no silent swallowing.
- Internal stack traces never exposed to end users.
- Error messages free of sensitive data (passwords, PII, internal IDs).
- Consistent error format across all API responses.

---

## Healthcare Data Privacy

### Data sensitivity

- **Customer and healthcare-related information treated as sensitive** by default.
- No assumption of any specific compliance regime (HIPAA, GDPR, PCI-DSS) as architecturally automatic.
- Regulatory and contractual requirements are **open business/legal decisions**.

### Privacy and security-ready architecture

The architecture supports the following through design:

- **Least privilege** — minimal access for all roles.
- **Data minimization** — only collect and expose information required for operation.
- **Secure access** — authentication + authorization at every boundary.
- **Auditability** — all important business/security events logged.
- **Secure transmission** — TLS everywhere; provided by deployment infrastructure.
- **Secure storage** — password hashing, selective field encryption where justified, not applied indiscriminately.
- **Controlled data exposure** — API responses include only required fields; sensitive fields omitted or masked.
- **Privacy-conscious logging** — no PII in logs; if required for debugging, access restricted to development environments only.

### Field-level encryption

- **Not automatically applied to every PII field.**
- Only introduced when there is a **real requirement** (e.g., specific regulatory mandate, justified threat model).
- Operational consequences considered before selecting (key management, performance, queryability).
- If introduced, selective field-level encryption for the minimum set of fields justified by requirements.

### Compliance

- **Not assumed** — marked as business/legal decision.
- Architecture is **privacy- and security-ready** so that compliance controls can be added later with minimal friction.
- Audit logs, data minimization, least privilege, and secure-by-design patterns facilitate future compliance implementation.

---

## Audit Architecture

### Audit log requirements

- **Append-only** — no UPDATE or DELETE operations permitted on audit log entries.
- **Protected from modification** — database permissions restrict write access to append-only; application-level enforcement.
- **Protected from deletion** — same; permissions and possible triggers prevent removal.
- **Access-controlled** — only authorized roles can view audit logs; viewing may require admin+ privileges.

### What is logged (minimum necessary)

Each audit log entry contains:

- `entity_type` — what kind of resource (bookings, customers, staff, services, users, bookings_status, etc.)
- `entity_id` — the specific record identifier
- `action` — what happened (created, updated, status_transition, rescheduling, assignment, cancellation, login, permission_denied, etc.)
- `performed_by` — user ID who performed the action (or system, or NULL for automated processes)
- `reason` — optional free-form reason; **minimized for sensitive PII**
- `changes_json` — optional minimal changes summary; **no sensitive PII unless justified**
- `created_at` — timestamp

### What is NOT logged

- Complete before/after snapshots containing sensitive data
- Full customer records or booking details unless specifically justified
- Password hashes or authentication tokens
- Any PII beyond what is absolutely necessary for auditability

### Audit log access

- Written via application code or database triggers that enforce append-only.
- Read access restricted to admin roles and potentially auditors/compliance.
- Log entries never modified after creation.
- Retention policy determined by compliance/legal requirements (Phase 1 decision).

### Auditable events (examples)

- User login/logout
- Role/permission changes
- Booking creation, status transitions, cancellation, rescheduling
- Staff assignment/reassignment
- Customer profile updates
- Service activation/deactivation
- Permission denials
- Configuration changes

---

## Testing Strategy

### Testing pyramid

- **Unit tests** — business logic, utility functions, validation schemas.
- **Integration tests** — API endpoints, database interactions, module interactions.
- **End-to-end tests** — critical user workflows (registration → booking → completion).
- **Authorization tests** — permission boundaries across all roles.
- **Concurrency tests** — booking race conditions, concurrent request handling.
- **Regression tests** — ensure fixes don't break existing behavior.

### Focus on behavior and business rules

- Tests validate **what** the system does, not **how** it does it.
- Deterministic tests — no random data, no flaky timing dependencies.
- Test data is controlled and predictable.

### Prioritized workflows (customer perspective)

1. Customer registration → Authentication
2. Service selection
3. Appointment selection
4. Booking
5. Staff assignment
6. Staff acceptance
7. Visit progress
8. Completion

### Important failure paths

- Invalid input validation
- Unauthorized access attempts
- Failed booking (concurrent, unavailable slot)
- Double booking attempts
- Cancellation
- Rescheduling
- Staff reassignment
- Notification failure
- Password reset flow

### Test isolation

- Each test independent; no shared mutable state across tests.
- Test fixtures/data setup per test, not global state.
- Database transactions rolled back after each test.

### CI integration

- Unit tests run on every PR.
- Integration tests run on PR and CI.
- E2E tests run on merge-to-main or scheduled.
- Test coverage numbers are **not** the primary goal — meaningful workflow coverage is.
- Failing tests are not weakened, skipped, or deleted to make CI green.

---

## Observability

### Structured logging

- JSON format for all log output.
- Logs include request/correlation ID for traceability.
- No sensitive information in logs (PII, passwords, tokens, full customer records).
- Log correlation through the request pipeline.

### Request/correlation IDs

- Unique ID assigned to each incoming request.
- Passed through all layers: frontend → API → domain → database.
- Enables tracing a single request through the entire system.
- Log entries include the correlation ID.

### Error monitoring

- Errors captured with context (correlation ID, route, user role) but **no sensitive data**.
- Stack traces captured internally; not exposed to clients.
- Error grouping and alerting configured.

### Metrics

- Request rate (successful and by status code).
- Error rate by type.
- Booking success/failure rate.
- Authentication success/failure rate.
- Custom business metrics as needed.

### Tracing (where justified)

- Critical workflows traced (booking flow, authentication).
- Trace IDs propagated through async boundaries where applicable.
- Not over-instrumented — only where it provides real operational value.

### Health checks

- Basic liveness endpoint (`/healthz` or `/api/v1/health`).
- Readiness check — depends on database connectivity, etc.
- Response format consistent with API error format.

### Sensitive data in observability

- **Never** sensitive information in logs, metrics, traces, or health responses.
- Correlation IDs do not contain secrets.
- Error messages in monitoring free of PII.

---

## Accessibility

### WCAG 2.2 AA target

Accessibility designed from the beginning, not retrofitted.

### Keyboard navigation

- All interactive elements reachable via Tab key.
- Focus visible indicator on all elements.
- Escape key closes dialogs/modals.
- Skip links for main content navigation.

### Focus management

- Focus trap in modal dialogs.
- Focus returns to opener after dialog close.
- Programmatic focus where needed for screen reader flow.

### Screen readers

- Proper `label` elements associated with form controls.
- `aria-label` or `aria-labelledby` where visible text isn't available.
- `role="dialog"` for modals with `aria-modal="true"`.
- `aria-live="polite"` or `aria-live="assertive"` for status messages.
- Meaningful link and button text (not "click here").

### Forms

- Labels programmatically associated with inputs.
- Error messages announced to screen readers.
- Fieldset/legend for grouped controls.
- Disabled state semantics.

### Contrast

- Color contrast ratio of at least 4.5:1 for normal text (WCAG AA).
- 3:1 for large text (18pt+ or 14pt+ bold).
- Non-text contrast of at least 3:1 for UI components.

### Touch targets

- Minimum 44x44px touch target size.
- Adequate spacing between touch targets.
- No touch targets too close together.

### Error messaging

- Clear, descriptive error messages.
- Programmatically associated with form fields.
- Appear near the field in error.
- Understandable without relying on color alone.

### Reduced motion

- Respect `prefers-reduced-motion` media query.
- Avoid automatic carousels, animations that play without user control.
- Provide reduced-motion alternatives.

### Responsive behavior

- Mobile-first approach.
- Layouts reflow gracefully at breakpoints.
- No horizontal scrolling on mobile.
- Touch and keyboard modes both supported.

---

## SEO

### Public page SEO

Every public-facing page is designed for search visibility.

### Metadata per page

- `<title>` — unique, descriptive per page.
- `<meta name="description">` — concise summary (50-160 characters).
- `<meta name="keywords">` — relevant terms (used sparingly).
- `viewport` meta tag for responsive behavior.

### Open Graph tags

- `og:title`, `og:description`, `og:image`, `og:type`, `og:url` for social sharing.

### Canonical URLs

- Single canonical URL per page; duplicate content avoided via canonical links.

### Sitemap

- Generated sitemap.xml includes all public pages.
- Updated as part of build/deployment process.

### robots.txt

- Appropriate for site structure — allows search engines to crawl meaningful content.
- Disallows admin/private routes and internal search results.

### Structured data

- Where applicable: `Organization`, `Service`, `MedicalBusiness` schema.org types.
- Not over-used — only where it provides genuine discoverable benefit.

### Semantic HTML

- Proper heading hierarchy (h1-h6).
- Landmark regions (nav, main, article, aside, form).
- Meaningful link text.

### Image optimization

- Appropriate sizes and formats (WebP, modern).
- Lazy-loading for below-the-fold images.
- Descriptive `alt` text for informative images; decorative images via CSS or empty alt.

### Core Web Vitals

- Consider LCP, FID/INP, CLS where relevant.
- Not over-optimized — performance measured, not guessed.

### No low-value SEO pages

- Every public page has meaningful, useful content.
- No mass-produced thin content pages.

---

## Performance

### Database query efficiency

- Avoid N+1 queries — explicit query planning.
- Appropriate indexes on frequently queried columns.
- Query pagination with limit; avoid fetching all rows.
- Read-only replicas considered if read-heavy workload emerges.

### API latency

- Measure before optimizing — no speculative performance infrastructure.
- API response times tracked via observability.

### Bundle size

- Monitor frontend bundle size.
- Avoid unnecessary dependencies — each new package justified.
- Code splitting via Next.js route groups.

### Images

- Optimized, responsive, lazy-loaded.
- Modern formats (WebP, AVIF) where browser support justifies.
- No oversized images delivered.

### Network requests

- Minimize where possible — combine where beneficial.
- API responses not overly verbose.

### Mobile performance

- Tested on real mobile devices.
- Touch targets, typing, navigation all performant.

### Caching

- **After understanding actual access patterns** — not premature.
- Browser caching headers set appropriately.
- API response caching (GET) where safe and justified.
- **Do not introduce complex caching infrastructure** (Redis, etc.) unless concrete requirement proves benefit.

### Performance philosophy

- Measure before adding complexity.
- Simple solution first; optimize only when profiling shows real bottleneck.
- Performance is part of design — considered from the start, not bolted on later.

---

## Infrastructure Strategy

### Single deployable unit

- The modular monolith is **one deployable unit**.
- Frontend (Next.js) and backend (Express) deployed together or as coordinated deployments.
- Single version deployment — no inter-service coordination needed initially.

### PostgreSQL production database

- Single production PostgreSQL instance (or clustered setup if high availability required).
- Managed backups, monitoring, and point-in-time recovery.
- Connection pool managed via `pg` (node-postgres).
- No Redis in initial architecture.

### Frontend deployment

- Next.js production build.
- Static export (if applicable) or server deployment ( Vercel, Node.js host, etc.).
- Environment variables injected at deployment.

### Environment configuration

- All secrets via environment variables.
- .env files for local development — git-ignored.
- Configuration driven by environment, not hardcoded.

### Health checks

- `/healthz` endpoint returning basic status.
- Depends on: application running, database connectivity.
- Used by deployment platform for auto-healing.

### Deployment strategy

- Single modular monolith — gradual deployment feasible.
- No blue-green or canary infrastructure needed initially (single unit).
- Considered for Phase 1 if team/organizational requirements emerge.

### CI/CD (intended future quality gates)

- **install** — `npm install` / `pnpm install`
- **lint** — ESLint or equivalent
- **format check** — Prettier or equivalent
- **typecheck** — TypeScript compiler
- **unit tests** — unit test suite
- **integration tests** — integration test suite
- **security checks** — dependency vulnerability scanning
- **build** — Next.js build, TypeScript compilation
- **E2E tests** — where appropriate, after Phase 1

CI/CD not implemented during Phase 0 — documented for future setup.

---

## What We Deliberately Are NOT Building Yet

The following are explicitly out of scope for Phase 0 and will not be implemented until a concrete requirement justifies them:

- **Redis infrastructure** — kept out initially; only introduced if a real requirement proves PostgreSQL insufficient.
- **JWT + server-session hybrid authentication** — not prematurely chosen; session-based approach initially, mechanism evaluated in Phase 1.
- **Microservices architecture** — modular monolith chosen; microservices only if organizational/scaling requirements justify.
- **Application-layer encryption of every PII field** — selective only where justified; not automatic.
- **Specific compliance implementation** (HIPAA, GDPR, etc.) — marked as business/legal decision; not assumed architecturally.
- **Package-per-domain structure** — domains remain modules inside the modular monolith; packages only for genuinely shared functionality.
- **Generic SaaS template UI patterns** — healthcare-specific design, not generic template.
- **Background job queue infrastructure** — only if real requirements (email, WhatsApp, notifications) justify; transactional operations remain synchronous.
- **Complex performance infrastructure** — measure first; optimize only when real bottlenecks identified.
- **Multi-tenant architecture** — single-tenant design initially; multi-tenant only if required later.
- **Package extraction from monolith** — packages (ui, validation, config, types) are shared utilities only; not extracted per domain.

---

## Changes From Previous Phase 0

This final architecture makes the following changes from the previous Phase 0 proposal (phase-0-architecture-revised.md):

1. **Clarified repository structure** — explicitly documented `apps/web`, `apps/api`, `packages/ui`, `packages/validation`, `packages/config`, `packages/types`; business domains remain modules inside `apps/api/src/modules/`, not packages.

2. **Removed premature library choices** — Zod/Yup, bcrypt/Argon2, Helmet explicitly documented as Phase 1 decisions after dependency/version verification; architecture defines responsibilities, not concrete libraries.

3. **Refined booking concurrency** — more precise language: PostgreSQL transactions plus appropriate database-level temporal integrity constraints and idempotency enforce booking correctness after scheduling model is finalized; no premature selection of isolation levels or specific constraint types.

4. **Conceptual data model (not locked)** — explicit statement that Phase 0 defines a conceptual data model; exact columns and schema details not locked where the scheduling/business model is still unresolved.

5. **Distinguished confirmed requirements, recommendations, assumptions, open decisions, and Phase 1 decisions** — new structural requirement categorization for clarity.

6. **What we deliberately are NOT building yet** — new section explicitly listing out-of-scope items for Phase 0.

7. **Enhanced audit architecture** — more detailed guidance on append-only enforcement, sensitive information protection, and what IS/NOT logged.

8. **Refined dependency direction** — more explicit statement that business/domain logic must NOT depend on HTTP frameworks, Express objects, database implementation details, browser APIs, or UI components; framework-specific concerns at edges only.

9. **Accessibility refined** — WCAG 2.2 AA designed from beginning, not retrofitted; specific success criteria listed.

10. **Performance refined** — "measure before optimizing" principle made more explicit; caching after access pattern understanding, not premature.

11. **Infrastructure strategy added** — deployment considerations, health checks, CI/CD intended future gates.

12. **Changes from previous proposal clearly identified** — each change from the prior revision documented.

---

## Remaining Risks

The following risks are acknowledged and will be monitored/addressed in Phase 1 or as they emerge:

1. **Booking concurrency race conditions** — mitigated by PostgreSQL transactions and constraints, but exact mechanism depends on finalized scheduling data model. Risk: if constraints are insufficient, double-booking could occur.

2. **Authentication/authorization design** — unified system is chosen but exact mechanism (session vs JWT) is a Phase 1 decision. Risk: premature commitment could lead to rework.

3. **Sensitive data exposure risk** — minimized by data minimization and no-logging policies, but complexity of healthcare data means some PII may be unavoidable. Risk: accidental exposure in logs, errors, or URLs.

4. **Compliance assumption risk** — architecture avoids assuming HIPAA/GDPR/PCI-DSS, but actual regulatory requirements may impose constraints not anticipated. Risk: re-architecture if compliance requirements emerge late.

5. **Rescheduling business model ambiguity** — whether rescheduling modifies booking state, creates new records, or uses another model is unresolved. Risk: inconsistent behavior across the system.

6. **Package proliferation risk** — as domains grow, there's risk of creating unnecessary packages or module splits. Risk: managed through rigorous ownership review.

7. **Observability blind spots** — structured logging avoids sensitive data, but ensuring complete traceability across all boundaries is ongoing work. Risk: incomplete observability hinders debugging and compliance.

8. **Dependency security risk** — third-party packages may have vulnerabilities discovered after adoption. Risk: regular vulnerability scanning and update schedule required.

9. **Performance unanticipated bottlenecks** — modest architecture may not anticipate scale-specific performance needs. Risk: measure-and-optimize approach; not pre-optimizing.

10. **Rescheduling edge cases** — complex rescheduling scenarios (staff unavailability, slot conflicts, administrative intervention) may reveal unmodeled business rules. Risk: iterative modeling in Phase 1 and beyond.

---

## Phase 0 Approval Gate

**Phase 0 is complete.** This architecture represents the simplest robust architecture for the Home Healthcare Platform requirements.

**What was implemented:**
- Modular monolith architecture with domain modules inside the monolith
- Next.js App Router frontend with React + TypeScript
- Node.js + Express + TypeScript backend
- PostgreSQL as transactional source of truth
- Deep modules with small meaningful interfaces
- Strong dependency direction toward business concepts
- Unified identity architecture with role-aware authorization
- WCAG 2.2 AA accessibility target
- OWASP ASVS security baseline
- Versioned REST API at /api/v1/...
- Audit architecture (append-only, sensitive data protected)
- Testing strategy focused on behavior and business rules
- Observability with structured logging and correlation IDs
- SEO strategy for public pages
- Performance considerations measured, not speculative
- Infrastructure strategy for single deployable unit

**Open decisions awaiting Phase 1:**
- Exact authentication mechanism
- Database isolation level for booking concurrency
- Booking concurrency constraint types
- Selective PII field encryption
- Background job queue provider
- API versioning beyond v1
- Compliance implementation details
- Redis necessity

**Phase 1 has NOT started.** The next phase will concretize the Phase 1 decisions listed above, evaluate concrete library choices, and begin actual application development.

---

PHASE 0 COMPLETE — WAITING FOR APPROVAL.