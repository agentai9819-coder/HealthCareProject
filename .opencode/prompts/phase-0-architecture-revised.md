# Phase 0 — Revised Home Healthcare Platform Architecture Discovery

## PROJECT GOAL

We are building a production-quality home healthcare platform.

This is NOT an AI proof of concept.
This is NOT a throwaway demo.

The goal is software that a strong human engineering team could inherit, maintain, test, secure and extend.

The system should be:

- robust
- readable
- maintainable
- secure
- testable
- accessible
- performant
- appropriately scalable
- easy to understand
- resistant to AI-generated technical debt

Robustness must come from good design, clear boundaries, validation, database integrity and testing — NOT unnecessary complexity.

## CONFIRMED REQUIREMENTS, ARCHITECTURAL RECOMMENDATIONS, ASSUMPTIONS, OPEN DECISIONS, PHASE 1 DECISIONS

**CONFIRMED REQUIREMENTS**: Home healthcare platform with public website, customer portal, staff portal, and admin portal. Core workflow: service discovery → selection → appointment → booking → staff assignment → visit → completion.

**ARCHITECTURAL RECOMMENDATIONS**: Modular monolith with deep modules, PostgreSQL as source of truth, Next.js App Router, session-based auth with role-aware authorization, PostgreSQL transactions for booking concurrency, Redis excluded initially, WCAG 2.2 AA accessibility, security throughout.

**ASSUMPTIONS**: PostgreSQL can handle booking concurrency with transactions and constraints; currently supported Node.js LTS will be used; compliance requirements are business decisions, not assumed architecturally; TLS provided by deployment infrastructure.

**OPEN DECISIONS**: Exact API structure beyond v1 boundaries; whether Redis is needed for specific requirements; specific encryption strategy for PII beyond transit/TLS; background job queue provider; precise password reset token architecture; multi-tenant considerations if required later.

**PHASE 1 DECISIONS**: Detailed authentication mechanism (session vs JWT evolution); specific database isolation level selection; specific scheduling mechanism; compliance implementation details; background job infrastructure; detailed audit log schema beyond append-only baseline.

---

## CURRENT REPOSITORY STATE

The repository is intentionally empty of application code.

Currently it contains engineering instructions and skills.

Do NOT assume application code exists.
Do NOT start implementation.
Do NOT scaffold Next.js.
Do NOT scaffold Express.
Do NOT create database migrations.
Do NOT create UI components.
Do NOT create API endpoints.
Do NOT create authentication implementation.
Do NOT install application dependencies.
Do NOT install additional skills.
Do NOT create multiple coding agents.

Phase 0 is architecture discovery only.

---

## TARGET TECHNOLOGY

The initial technology direction is:

**Frontend:**

- Next.js
- React
- TypeScript

**Backend:**

- Node.js
- Express
- TypeScript

**Database:**

- PostgreSQL

**Potential infrastructure:**

- Redis (out initially, unless real requirement proves needed)
- Background jobs/queue (evaluate with real requirements)
- Object/file storage

Every technology must have a clear justification.

---

## ARCHITECTURE DIRECTION

The initial architecture should be a MODULAR MONOLITH.

Do NOT design a microservices architecture for the initial system.

The architecture should provide:

- strong domain boundaries
- clear ownership
- high cohesion
- low coupling
- deep modules
- small meaningful interfaces
- clear dependency direction
- testability
- maintainability

Potential business domains include:

- authentication
- users
- customers
- staff
- services
- addresses
- bookings
- leads
- notifications
- analytics
- administration

Do not create modules merely to increase the number of folders. Split when there is a meaningful responsibility or architectural boundary. Keep domain modules inside the modular monolith, not one package per domain.

**Explicitly document the repository structure:**

- apps/web
- apps/api
- packages/ui
- packages/validation
- packages/config
- packages/types

Business domains must remain modules inside:

- apps/api/src/modules

Do not create one package per business domain.

---

## PRODUCT

The platform will eventually support:

### Public Website

Healthcare service discovery and business information.

Potential areas:

- Home
- Services
- Individual service pages
- About
- Contact
- Locations where applicable
- FAQs/resources where justified

### Customer Portal

Customers should eventually be able to:

- create an account
- authenticate
- manage their profile
- manage addresses
- browse services
- select services
- select appointment times
- create bookings
- view booking history
- view booking status
- manage appropriate booking actions
- receive relevant notifications

### Staff Portal

Staff should eventually be able to:

- authenticate
- view assigned work
- view schedules
- manage availability where authorized
- accept/manage assignments
- update booking/visit status
- view information necessary to perform assigned work

### Admin / Operations Portal

Administrators should eventually be able to:

- manage customers
- manage staff
- manage services
- manage bookings
- assign staff
- manage leads
- monitor operations
- manage appropriate configuration
- review audit information
- view operational reporting

Do not invent business rules where requirements are ambiguous. Clearly identify assumptions.

---

## CORE BUSINESS WORKFLOW

Analyze the complete lifecycle:

Customer

→ Service discovery
→ Service selection
→ Address
→ Availability
→ Appointment selection
→ Booking
→ Assignment
→ Staff acceptance
→ Visit progress
→ Completion

Also analyze:

- cancellation
- rescheduling
- failed booking
- unavailable staff
- unavailable appointment slot
- concurrent booking attempts
- notification failure
- staff reassignment
- administrative intervention

Treat booking rescheduling as an auditable action/history, not automatically as a booking lifecycle state.

Do not invent final business rules without identifying them as assumptions or open decisions.

---

## BOOKING CONCURRENCY

Booking is a business-critical workflow.

Analyze race conditions.

Do not assume this is safe:

1. Check availability
2. Insert booking

Consider:

- database transactions
- constraints
- locking where justified
- slot ownership
- idempotency
- concurrent requests

**Recommend the simplest robust mechanism.**

Do not introduce Redis locks automatically if PostgreSQL can provide the required guarantee safely.

**Refine booking concurrency.** Do not prematurely select SERIALIZABLE, REPEATABLE READ, locking strategy, or a specific scheduling mechanism. State that PostgreSQL transactions plus appropriate database-level temporal integrity constraints and idempotency will enforce booking correctness after the scheduling model is finalized.

**Use PostgreSQL transactions and appropriate database constraints for booking concurrency. Do not use pg_trgm for temporal overlap protection.**

A successful booking must maintain business invariants.

Important booking state transitions should be explicit and auditable.

---

## FRONTEND ARCHITECTURE

The frontend should use Next.js + React + TypeScript.

Analyze:

- route structure
- public vs authenticated areas
- customer portal
- staff portal
- admin portal
- shared UI
- state management
- server/client boundaries
- API communication
- form handling
- validation
- error/loading/empty states
- accessibility
- responsive behavior
- SEO

**Use Next.js App Router.**

The product must feel like a trustworthy healthcare platform, not a generic SaaS template.

For UI/UX decisions follow .opencode/skills/frontend-design/SKILL.md.

---

## BACKEND ARCHITECTURE

Analyze a domain-oriented modular monolith.

Determine appropriate responsibilities for:

- routes
- controllers
- application/use-case logic
- domain/business logic
- persistence/data access
- validation
- infrastructure
- external integrations

**Do NOT force every domain into identical layers.**

Only introduce a layer when it represents meaningful responsibility.

**Controllers should remain thin.**

Business rules should have clear ownership.

**Infrastructure should not leak throughout the business logic.**

---

## DATABASE

PostgreSQL is the primary database.

Design a proposed conceptual data model.

Consider likely entities:

- users
- roles
- customers
- customer addresses
- staff
- staff availability
- services
- service categories
- bookings
- booking assignments
- booking status history
- leads
- notifications
- audit logs

**For each major entity explain:**

- responsibility
- important relationships
- important constraints
- important indexes
- lifecycle considerations

**Pay particular attention to booking integrity.**

**Keep PostgreSQL as the source of truth for transactional business data.**

Do not rely exclusively on application code for critical invariants.

**Keep the database model conceptual at Phase 0.** Do not prematurely lock exact columns or schema details where the scheduling/business model is still unresolved.

Avoid N+1 queries.

Avoid N+1 queries.

Do not introduce caching before understanding the actual access pattern.

Database migrations must be explicit and reproducible.

Never modify production schema manually when the project migration system should own the change.

---

## AUTHENTICATION AND AUTHORIZATION

Design authentication and authorization separately.

Analyze:

- customer authentication
- staff authentication
- admin authentication
- sessions/tokens
- password security
- password reset
- role-based access
- resource-level authorization
- least privilege
- session revocation
- auditability

**Use one unified authentication/identity architecture with role-aware authorization.**

Do not assume authenticated users can access all resources.

**Do not lock the authentication mechanism to session-based auth yet.** Keep one unified identity/authentication architecture with role-aware authorization, but leave the exact session/token mechanism as an implementation decision to be finalized after evaluating the selected deployment model.

**Do not prematurely choose a JWT + server-session hybrid.** Use a session-based approach initially with the option to evolve.

Explain how authorization decisions should be enforced.

---

## SECURITY AND HEALTHCARE DATA

Treat customer and healthcare-related information as sensitive.

Use OWASP ASVS principles as the security baseline.

Analyze:

- authentication
- authorization
- session security
- input validation
- injection prevention
- XSS
- CSRF where applicable
- secure headers
- secrets
- logging
- error handling
- sensitive data exposure
- dependency security
- auditability
- data minimization

**Never expose sensitive information in:**

- logs
- URLs
- analytics
- telemetry
- error messages
- debug output

**Do not automatically application-encrypt every PII field.** Use appropriate encryption at transit/storage and selective field encryption only where justified.

**Do not assume a specific healthcare compliance requirement.** Mark regulatory/legal scope as a business decision while keeping the architecture privacy and security ready.

**Make audit logs append-only and protect sensitive information.**

---

## API ARCHITECTURE

Use a versioned REST API.

Analyze appropriate API boundaries.

Potential examples:

/api/v1/auth
/api/v1/customers
/api/v1/services
/api/v1/bookings
/api/v1/staff
/api/v1/leads

**Do not blindly use these endpoints.**

Determine the actual API structure.

Analyze:

- validation
- authentication
- authorization
- request/response contracts
- error format
- idempotency
- pagination
- filtering
- sorting
- API documentation

**Do not accidentally expose the database schema as the API contract.**

API behavior should be documented.

---

## TESTING STRATEGY

Design an appropriate testing pyramid.

Consider:

- unit tests
- integration tests
- end-to-end tests
- authorization tests
- business workflow tests
- concurrency tests
- regression tests

**Prioritize meaningful workflows.**

Tests should validate behavior rather than implementation details.

Prioritize meaningful workflows such as:

Customer registration
→ Authentication
→ Service selection
→ Appointment selection
→ Booking
→ Staff assignment
→ Staff acceptance
→ Visit progress
→ Completion

Test important failure paths and authorization boundaries.

Do not optimize for test count alone.

Do not weaken, skip or delete a failing test merely to make CI green.

Do not write tests purely to increase coverage numbers.

Tests must be deterministic.

---

## OBSERVABILITY

Design an appropriate observability strategy.

Consider:

- structured logging
- request/correlation IDs
- error monitoring
- metrics
- tracing
- health checks

**Sensitive information must never appear in logs or telemetry.**

Observability should help answer: "What happened, when, where and why?"

The system should eventually support: structured logs, error monitoring, metrics, tracing, health checks.

---

## REDIS / BACKGROUND JOBS

Evaluate whether Redis is actually needed initially.

**Keep Redis out initially unless a real requirement proves it is needed.**

If recommended, explain exactly why.

Potential uses:

- caching
- rate limiting
- temporary state
- locks
- queue infrastructure

**Do not introduce Redis merely because it is common.**

Similarly evaluate background jobs for:

- email
- WhatsApp
- notifications
- non-critical asynchronous processing

**Keep transactional business operations synchronous where required for correctness.**

Do not cache everything.

Background jobs should be used for work that does not need to block the primary request, such as:

- Email
- Notifications
- WhatsApp messages
- Non-critical analytics processing
- Other asynchronous work

Business-critical database changes must complete transactionally before dependent asynchronous work is considered successful.

---

## SEO

Analyze SEO architecture for the public website.

Consider:

- metadata
- sitemap
- robots
- canonical URLs
- Open Graph
- structured data
- semantic HTML
- internal linking
- image optimization
- Core Web Vitals
- location/service pages where genuinely valuable

**Avoid mass-producing low-value SEO pages.**

Every public page should have meaningful, useful content.

---

## ACCESSIBILITY

Target WCAG 2.2 AA principles.

Analyze:

- keyboard navigation
- focus management
- semantic HTML
- screen readers
- forms
- dialogs
- contrast
- touch targets
- errors
- responsive design
- reduced motion

Accessibility is part of implementation, not a final polish step.

---

## PERFORMANCE

Analyze performance risks early.

Consider:

- database queries
- N+1 queries
- API latency
- rendering strategy
- bundle size
- images
- network requests
- mobile performance
- caching

**Do not introduce complex optimization without justification.**

Measure before introducing complex performance infrastructure unless the risk is obvious.

---

## CODE QUALITY

The implementation must follow the principles in the installed skills.

Especially:

SEARCH
→ UNDERSTAND
→ PLAN
→ MODIFY
→ VERIFY
→ REVIEW
→ SIMPLIFY

Never:

PATCH
→ PATCH
→ PATCH
→ PATCH

Avoid:

- duplicate implementations
- stale code
- dead code
- unnecessary abstractions
- unnecessary wrappers
- unnecessary interfaces
- generic utility dumping grounds
- giant functions
- giant components
- premature generalization
- unnecessary dependencies

**Remove premature library choices such as Zod/Yup, bcrypt/Argon2, Helmet.** Architecture should define responsibilities and security requirements. Concrete library choices belong to implementation after dependency/version verification.

**Enforce no duplicate business logic, no stale code and no dead code.**

**Prefer modifying/refactoring existing code over adding parallel implementations.**

Every business rule must have one authoritative owner.

**Preserve all previously agreed principles:**

- modular monolith
- deep modules
- KISS
- YAGNI
- no unnecessary layers
- no package proliferation
- no duplicate business logic
- no stale implementations
- no dead code
- no speculative infrastructure
- PostgreSQL as transactional source of truth
- Redis excluded initially
- WCAG 2.2 AA
- security
- testing
- observability
- SEO
- performance
- accessibility

---

## SELF-CRITIQUE

After producing the initial architecture, challenge it.

Look for:

- unnecessary layers
- unnecessary modules
- unnecessary packages
- unnecessary infrastructure
- premature microservices
- premature Redis
- premature queues
- duplicate sources of truth
- weak module boundaries
- circular dependencies
- shallow modules
- overly large modules
- security gaps
- authorization gaps
- database integrity gaps
- booking race conditions
- testing gaps
- accessibility gaps
- SEO gaps
- operational gaps

**Simplify the architecture where possible.**

The final architecture should be the SIMPLEST architecture that is robust enough for the actual requirements.

---

## OUTPUT REQUIRED

Create NO application code.

Create NO scaffold.

Create NO database migrations.

Create NO components.

Create NO API endpoints.

Create NO package installation.

You may inspect the repository and existing configuration/skills.

Provide a detailed Phase 0 architecture proposal containing:

1. **Product understanding**

   Confirmed requirements: Home healthcare platform with public website, customer portal, staff portal, and admin portal. Core workflow: service discovery → selection → appointment → booking → staff assignment → visit → completion.

   Architectural recommendations: Modular monolith with deep modules, PostgreSQL as source of truth, Next.js App Router, session-based auth with role-aware authorization.

   Assumptions: PostgreSQL can handle booking concurrency with transactions and constraints; Node LTS (currently supported version) will be used; compliance requirements are a business decision, not assumed architecturally.

   Open decisions: Exact API structure beyond v1 boundaries; whether Redis is needed; specific encryption strategy for PII beyond transit/TLS.

2. **Users and roles**

   - Customer: authenticates, manages profile/addresses, books services, views booking history
   - Staff: authenticates, views assigned work/schedules, manages availability, accepts assignments, updates visit status
   - Admin: authenticates, manages customers/staff/services/bookings/leads, monitors operations, reviews audit info
   - Unified authentication architecture with role-aware authorization (single auth system, not separate for each role)

3. **Core workflows**

   Customer: service discovery → service selection → address → availability → appointment selection → booking → staff acceptance → visit progress → completion
   Staff: authenticate → view assigned work → view schedules → manage availability → accept/manage assignments → update booking/visit status → view necessary info
   Admin: manage customers → manage staff → manage services → manage bookings → assign staff → manage leads → monitor operations → review audit info → manage configuration

4. **Domain boundaries**

   - authentication: unified identity architecture, role-aware authorization
   - customers: profile, addresses, booking history
   - staff: availability, assignments, schedules
   - services: categories, details, pricing
   - addresses: customer and staff addresses
   - bookings: core lifecycle with audit trail; rescheduling as auditable action, not state transition
   - leads: tracking and management
   - notifications: opt-in communications
   - administration: configuration, user management, operational reporting

5. **Modular monolith architecture**

   Single repository, single deployable unit. Domain modules own cohesive business capabilities. Modules contain: routes, controllers, application logic, domain logic, types. No package-per-domain. Shared utilities only where they reduce duplication meaningfully. Deep modules with small interfaces.

6. **Frontend architecture**

   - Next.js App Router
   - React + TypeScript
   - Public website (service discovery)
   - Customer portal (authenticated)
   - Staff portal (authenticated)
   - Admin portal (authenticated)
   - Shared UI components for common patterns
   - Server/Client boundaries using Next.js server components where appropriate
   - Form handling with Zod/Yup validation
   - Error/loading/empty states considered from the start
   - Accessibility (WCAG 2.2 AA) built-in, not retrofitted
   - SEO metadata per page
   - Responsive design mobile-first

7. **Backend architecture**

   - Node.js + Express + TypeScript
   - Domain-oriented module structure inside modular monolith
   - Each module may contain: routes, controllers, application/use-case logic, domain logic, validation, types
   - Controllers remain thin; business rules in application/domain modules
   - Persistence concerns isolated via repository pattern or direct DB access within transactions
   - Validation at system boundaries (API layer)
   - No framework-specific types leaking into business logic
   - Module ownership: one authoritative owner per business rule

8. **Dependency direction**

   Dependencies point toward stable business concepts.

   - Business/domain logic must NOT depend on: HTTP frameworks, Express request/response objects, database implementation details, browser APIs, UI components
   - Infrastructure may depend on application/domain contracts
   - Framework-specific concerns at the edges only
   - No circular dependencies
   - Example dependency flow: UI → API client → backend modules → PostgreSQL

9. **Database conceptual model**

   Core entities:

   - **users**: id, name, email, password_hash, role, created_at, updated_at
   - **roles**: id, name, permissions (managed internally)
   - **customers**: id, user_id (→ users), phone, address, created_at, updated_at
   - **customer_addresses**: id, customer_id, street, city, state, postal_code, type, default, created_at
   - **staff**: id, user_id (→ users), specialization, created_at, updated_at
   - **staff_availability**: id, staff_id, date, start_time, end_time, is_available, created_at
   - **services**: id, name, description, duration, price, category, is_active, created_at, updated_at
   - **service_categories**: id, name, description, created_at, updated_at
   - **bookings**: id, customer_id, staff_id (nullable), service_id, start_time, end_time, status, created_at, updated_at
   - **booking_status_history**: id, booking_id, from_status, to_status, changed_by, changed_at, reason, created_at
   - **leads**: id, name, contact, source, status, notes, created_at, updated_at
   - **notifications**: id, recipient_type, recipient_id, type, content, status, created_at, sent_at
   - **audit_logs**: id, entity_type, entity_id, action, performed_by, reason, changes_json, created_at (append-only)

   Important constraints:

   - Foreign keys: bookings → customers, bookings → staff (optional), bookings → services
   - Unique constraints: users.email, customers.user_id (one-to-one)
   - Check constraints: bookings.start_time < bookings.end_time; end_time > now()
   - Indexes: bookings on (start_time, end_time) for overlap queries; bookings on customer_id; bookings on staff_id; bookings on status
   - Lifecycle: bookings have status transitions; rescheduling creates new audit log entry, doesn't automatically change booking state

10. **Booking lifecycle**

    - requested → confirmed → in_progress → completed → cancelled
    - Rescheduling: creates audit log entry with reason, may result in new booking or status update; not automatic lifecycle state transition
    - Concurrency: PostgreSQL transactions with appropriate constraints; no pg_trgm for temporal protection
    - Concurrent booking attempts: handled via database constraints and transactions, not application-level check-then-insert

11. **Booking concurrency strategy**

    - Use PostgreSQL transactions with SERIALIZABLE or REPEATABLE READ isolation where needed
    - Use database constraints (EXCLUDE constraint, unique constraints on time slots) for overlap prevention
    - Application-level idempotency keys for booking operations
    - No Redis locks unless PostgreSQL cannot guarantee the required safety
    - Successful booking maintains business invariants (slot not double-booked)

12. **Authentication strategy**

    - Unified authentication/identity architecture with role-aware authorization
    - Separate authentication for: customers, staff, admins (single system with roles)
    - Session-based approach initially (not premature JWT + server-session hybrid)
    - Password security: bcrypt or argon2 with appropriate work factor
    - Password reset flow with time-limited tokens
    - Session revocation mechanism
    - Resource-level authorization enforced per route/handler
    - Least privilege: users can only access resources they own or are explicitly authorized for

13. **Authorization strategy**

    - Authorization answers: "Can this user perform this action on this resource?"
    - Least privilege model
    - Role-based access control combined with resource-level checks
    - Never assume authentication = authorization
    - Customer can access own resources; staff can access assigned resources; admin can access all within scope
    - Authorization decisions enforced at API route level, not duplicated in every handler
    - Sensitive operations have appropriate auditability

14. **API architecture**

    - Versioned REST API: /api/v1/...
    - API boundaries validate input, authenticate where required, authorize, execute business logic, return consistent responses
    - Error format consistent across API
    - Do not expose internal database structures as API contract
    - Potential endpoints: /api/v1/auth, /api/v1/customers, /api/v1/services, /api/v1/bookings, /api/v1/staff, /api/v1/leads
    - Validation at API boundary
    - Pagination, filtering, sorting where applicable
    - API documentation generated or maintained

15. **Validation strategy**

    - Validate untrusted data at system boundaries
    - Request bodies, query parameters, path parameters
    - Shared validation strategy using Zod or similar
    - Do not duplicate identical validation rules across multiple layers without reason
    - Validation does not replace authorization
    - Input sanitization where needed

16. **Error handling**

    - Errors must be explicit and useful
    - Never silently swallow errors
    - Preserve meaningful error causes and context
    - Do not expose internal stack traces or sensitive implementation details to end users
    - API errors follow consistent structure
    - Expected business outcomes modeled clearly rather than generic exceptions

17. **Audit strategy**

    - Audit logs are append-only
    - Protect sensitive information in audit logs
    - Log entity type, action, reason (no sensitive PII in reason field unless justified)
    - Audit log entries: entity_type, entity_id, action, performed_by, reason, changes_json, created_at
    - Audit log cannot be edited/deleted (append-only)
    - Important booking state transitions and rescheduling actions are audited

18. **Notification/background-job strategy**

    - Evaluate real requirements before introducing
    - Email: where appropriate, transactional (booking confirmations, etc.)
    - WhatsApp messages: where appropriate, opted-in communications
    - Notifications: in-app and/or opted-in communications
    - Non-critical asynchronous processing: after transaction commits
    - Background jobs do not block primary request
    - Transactional business operations complete synchronously first

19. **Redis decision**

    - **KEEP REDIS OUT initially** unless a real requirement proves it is needed
    - If later required: evaluate for caching, rate limiting, or temporary state
    - Do not introduce Redis merely because it is common
    - PostgreSQL provides transactional guarantees for booking concurrency

20. **Security architecture**

    - OWASP ASVS baseline
    - Authentication separate from authorization
    - Session management with revocation
    - Input validation at boundaries
    - Injection prevention
    - XSS protection
    - Secure headers (Helmet, etc.)
    - Secrets never hardcoded; used from secure environment
    - File handling with validation and type restrictions
    - API security: rate limiting considered after real pattern understood
    - Access control least privilege
    - Sensitive data not exposed in logs, URLs, error messages
    - Dependency security: regular updates, vulnerability scanning

21. **Healthcare data protection**

    - Customer and healthcare information treated as sensitive
    - Data minimization: only collect and expose information required for operation
    - Least-privilege access for all roles
    - Encryption in transit (TLS) mandatory; encryption at rest selective and justified
    - No application-encrypt every PII field automatically; selective field encryption where justified
    - Audit logs protect sensitive information
    - Compliance scope (HIPAA, GDPR, etc.) marked as business decision, not assumed architecturally
    - Architecture privacy and security ready for future compliance needs

22. **Accessibility strategy**

    - Target WCAG 2.2 AA principles
    - Keyboard navigation throughout
    - Focus management
    - Screen-reader semantics (proper labels, roles, states)
    - Accessible forms with proper labels
    - Accessible dialogs with focus trap and escape handling
    - Color contrast meets AA requirements
    - Touch targets minimum 44x44px
    - Clear error messaging
    - Reduced motion support
    - Responsive behavior

23. **SEO strategy**

    - Public-facing pages have meaningful, useful content
    - Metadata per page (title, description, keywords)
    - Open Graph tags for social sharing
    - Canonical URLs
    - Sitemap generated
    - robots.txt appropriate for site structure
    - Structured data where applicable (Healthcare Organization, Service)
    - Semantic HTML
    - Internal linking structure
    - Image optimization (appropriate sizes, formats)
    - Core Web Vitals considered
    - Avoid low-value SEO pages; every public page has genuine utility

24. **Performance strategy**

    - Database queries: avoid N+1, use proper indexing
    - API latency: measure before optimizing
    - Rendering strategy: Next.js App Router with appropriate server/client component boundaries
    - Bundle size: monitor, avoid unnecessary dependencies
    - Images: optimized, responsive, lazy-loaded
    - Network requests: minimize where possible
    - Mobile performance: tested and considered
    - Caching: after understanding access patterns; not premature
    - Do not introduce complex optimization without justification

25. **Testing strategy**

    - Unit tests: business logic, utils, components
    - Integration tests: API endpoints, workflows
    - End-to-end tests: critical user workflows (registration → booking → completion)
    - Authorization tests: permission boundaries
    - Concurrency tests: booking race conditions
    - Regression tests: ensure fixes don't break existing behavior
    - Tests focus on behavior and business rules, not implementation details
    - Deterministic tests
    - Prioritize: customer registration → authentication → service selection → appointment selection → booking → staff assignment → staff acceptance → visit progress → completion

26. **CI/CD strategy**

    - Do not implement during Phase 0
    - Eventually: install, lint, format check, typecheck, unit tests, integration tests, security checks, build, E2E tests where appropriate
    - CI pipeline catches: type errors, lint issues, test failures
    - Security checks include dependency vulnerability scanning

27. **Observability strategy**

    - Structured logging (JSON format)
    - Request/correlation IDs passed through system
    - Error monitoring (capture errors with context, not sensitive data)
    - Metrics: request rate, error rate, booking success/failure
    - Tracing: through critical workflows
    - Health checks: basic liveness/readiness
    - Sensitive information never in logs or telemetry

28. **Documentation strategy**

    - Architecture decisions documented as ADRs where significant
    - API documentation
    - Database schema documentation
    - Development environment setup
    - Runbooks for common operations
    - Documentation stays consistent with actual behavior
    - Do not document obvious implementation details merely for documentation's sake

29. **Development environment**

    - Node.js currently supported LTS version
    - PostgreSQL database (local or Docker)
    - npm/pnpm for dependency management
    - TypeScript type checking
    - Linting and formatting
    - Local development runs full stack (frontend + backend)

30. **Deployment considerations**

    - Single deployable unit (modular monolith)
    - PostgreSQL production database
    - Frontend: Next.js production build, static export or server deployment
    - Environment variables for secrets and configuration
    - Health checks endpoint
    - Gradual deployment strategy considered

31. **Major risks**

    - Booking concurrency race conditions (mitigated by PostgreSQL transactions/constraints)
    - Authentication/authorization bypass (mitigated by unified role-aware system)
    - Sensitive data exposure (mitigated by data minimization, no logging of PII)
    - Premature infrastructure adoption (mitigated by KISS/YAGNI review)
    - Compliance assumption risks (mitigated by marking as business decision)

32. **Trade-offs**

    - Session-based auth vs JWT: chosen session-based for simplicity, can evolve
    - PostgreSQL vs Redis for concurrency: PostgreSQL chosen first for transactional guarantees
    - Modular monolith vs microservices: monolith chosen for initial simplicity and team cohesion
    - Comprehensive audit logging vs performance: append-only design minimizes impact
    - Full accessibility from start vs retrofitting: chosen from start for cost of rework

33. **What we deliberately will NOT build yet**

    - Redis infrastructure without proven requirement
    - JWT + server-session hybrid without justified need
    - Microservices architecture
    - Application-encryption of every PII field
    - Specific compliance implementation (HIPAA/GDPR) as architectural assumption
    - Package-per-domain structure
    - Generic SaaS template patterns

34. **Assumptions**

    - PostgreSQL can handle booking concurrency with transactions and constraints
    - Currently supported Node.js LTS will be available for development and production
    - Compliance requirements (HIPAA, GDPR, etc.) are business decisions, not architectural assumptions
    - One supported browser version path plus mobile browsers
    - Single team initially maintaining the monolith
    - TLS is provided by deployment infrastructure (not handled at application level)

35. **Open questions**

    - Exact Redis need (if any); what specific requirements would trigger it
    - Detailed encryption strategy for PII at rest (selective vs comprehensive)
    - Specific compliance requirements and their architectural implications
    - Exact API versioning and deprecation strategy beyond v1
    - Background job queue provider (if needed beyond simple job scheduling)
    - Precise password reset token architecture
    - Multi-tenant considerations if required later

---

## PHASE GATE

This is Phase 0 only.

When finished:
- STOP
- Do not implement anything
- Do not continue to Phase 1

End exactly with:

PHASE 0 COMPLETE — WAITING FOR APPROVAL.