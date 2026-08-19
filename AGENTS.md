# Home Healthcare Platform — Engineering Constitution

## 1. Project Mission

This repository is for a production-quality home healthcare platform.

The goal is not to create an AI-generated proof of concept or a demo that merely works.

The software must be:

- Robust
- Maintainable
- Secure
- Readable
- Testable
- Accessible
- Performant
- Scalable where justified
- Easy for another senior engineer to understand
- Easy to modify without accumulating technical debt

Prefer simple, explicit and well-designed solutions over clever or unnecessarily abstract solutions.

---

# 2. Core Engineering Philosophy

The project follows:

- KISS — Keep It Simple
- YAGNI — You Aren't Gonna Need It
- SOLID where it provides real value
- Deep modules
- High cohesion
- Low coupling
- Clear ownership
- Single source of truth
- Explicit boundaries
- Incremental refactoring
- Behavior-focused testing

Robustness must come from good design, validation, invariants, testing and clear boundaries — not from adding unnecessary layers.

Do not confuse enterprise-quality software with excessive abstraction.

---

# 3. Architecture

The application will use a MODULAR MONOLITH architecture initially.

Do not introduce microservices unless there is a demonstrated business, scaling, deployment, reliability or organizational reason.

The initial architecture should favor:

- One coherent application
- Strong domain boundaries
- Independent domain modules
- Clear dependency direction
- Deep modules
- Small, meaningful interfaces
- Explicit infrastructure boundaries

A module should own a cohesive business capability.

Examples include:

- Authentication
- Users
- Customers
- Staff
- Services
- Bookings
- Addresses
- Leads
- Notifications
- Analytics

Do not split functionality into modules merely because files are becoming long.

Split when there is a meaningful responsibility or architectural boundary.

---

# 4. Deep Module Principle

Use deep modules.

Prefer:

A small, understandable interface with substantial coherent behavior behind it.

Avoid shallow chains such as:

UI
→ hook
→ helper
→ wrapper
→ adapter
→ service
→ utility
→ actual logic

when the behavior could reasonably belong to one cohesive module.

Every abstraction must reduce complexity for its callers.

If an abstraction makes the system harder to understand than the code it replaces, do not introduce it.

---

# 5. Dependency Direction

Dependencies must point toward stable business concepts.

Business/domain logic must not depend directly on:

- HTTP frameworks
- Express request/response objects
- database implementation details
- browser APIs
- UI components
- vendor-specific infrastructure

Infrastructure may depend on application/domain contracts where appropriate.

Keep framework-specific concerns at the edges of the system.

Do not allow infrastructure concerns to leak throughout business logic.

Avoid circular dependencies.

---

# 6. Module Ownership

Every business rule must have one authoritative owner.

Before creating new code:

1. Search the repository.
2. Find existing implementations of related behavior.
3. Identify the module that owns the responsibility.
4. Determine whether the existing implementation should be extended or refactored.
5. Only create new code when an existing module is not the correct home.

Never create a second implementation of an existing business rule without an explicit architectural reason.

---

# 7. AI Code Modification Rules

The default workflow is:

SEARCH
→ UNDERSTAND
→ PLAN
→ MODIFY
→ VERIFY
→ REVIEW
→ SIMPLIFY

Never use:

PATCH
→ PATCH
→ PATCH
→ PATCH

to accumulate fixes on top of poor structure.

Before changing existing code:

- Read the relevant implementation.
- Search for callers and dependencies.
- Search for related business logic.
- Read relevant tests.
- Understand existing conventions.
- Identify whether the change should be a modification, refactor or new capability.

Prefer improving the existing implementation over creating duplicate functionality.

Never create:

- `_v2`
- `_new`
- `_final`
- `_enhanced`
- `_copy`

variants.

Version control provides history.

---

# 8. Stale Code and Dead Code

When replacing functionality:

1. Find all references to the old implementation.
2. Migrate callers.
3. Remove obsolete implementation.
4. Remove obsolete imports.
5. Remove obsolete tests.
6. Remove obsolete configuration.
7. Run appropriate verification.

Do not leave old implementations in place merely because they might be useful later.

Do not leave:

- dead functions
- unused components
- unused imports
- unused variables
- unreachable code
- commented-out implementations
- duplicate constants
- obsolete configuration
- abandoned files

A change is not complete if it knowingly leaves avoidable stale code behind.

---

# 9. Code Quality

Code must be easy for a human engineer to read.

Prefer:

- Meaningful names
- Small focused functions
- Clear control flow
- Explicit behavior
- Local reasoning
- Strong cohesion
- Minimal nesting
- Consistent conventions
- Intention-revealing code

Avoid:

- Clever code
- Deep nesting
- Giant functions
- Giant components
- Generic abstraction for its own sake
- Premature optimization
- Premature generalization
- Excessive interfaces
- Excessive wrappers
- Generic utility dumping grounds
- Copy/paste implementations

If a function, class, module or component cannot be described clearly without repeatedly using "and", consider whether responsibilities should be separated.

Do not split code merely to reduce line count.

Optimize for conceptual clarity, not arbitrary file length.

---

# 10. Refactoring Rules

Refactor when the requested change exposes a structural problem that would otherwise cause duplication or architectural damage.

Refactor only the relevant area unless a broader cleanup is explicitly requested.

Do not silently perform unrelated refactoring.

Before a substantial refactor:

- Establish a verification baseline.
- Understand current behavior.
- Make incremental changes.
- Preserve behavior unless behavior change is intentional.
- Run relevant tests after each meaningful step.

After refactoring:

- Remove obsolete code.
- Verify references.
- Run tests.
- Run type checking.
- Run linting.
- Review the final diff.

---

# 11. Frontend Architecture

Frontend uses:

- Next.js
- React
- TypeScript

Frontend concerns must remain separate from backend concerns.

UI components should primarily handle:

- Presentation
- User interaction
- UI state
- Composition

Do not put substantial business rules or API infrastructure directly into presentation components.

API/service logic must have an appropriate home outside UI components.

Do not create a new abstraction simply because two components have a few similar lines.

Extract shared behavior when there is genuine shared responsibility.

---

# 12. Healthcare UI/UX

For every frontend/UI/UX task, MUST read and follow:

.opencode/skills/frontend-design/SKILL.md

The healthcare interface must be:

- Trustworthy
- Calm
- Professional
- Accessible
- Mobile-first
- Distinctive
- Human
- Easy to understand

Use:

- Soft blues
- Teals
- Whites
- Appropriate neutral tones
- Clean typography
- Generous whitespace
- Rounded cards where appropriate
- Subtle shadows
- Clear hierarchy

Avoid:

- Generic AI/SaaS templates
- Generic red-cross medical clichés
- Excessive gradients
- Visually noisy dashboards
- Meaningless decorative elements
- Lorem ipsum
- Fake statistics
- Fake testimonials presented as real
- Repetitive generic CTAs

Use realistic healthcare-specific content.

Do not use "Book Now" everywhere.

---

# 13. Staff and Admin Experience

Staff/admin interfaces should feel like real healthcare operations software.

Use appropriate patterns such as:

- Customer/patient-style information cards
- Appointment timelines
- Booking status
- Staff availability
- Today's schedule
- Operational KPIs
- Clear alerts
- Data-dense but uncluttered tables
- Search and filtering
- Clear empty states
- Clear loading states
- Clear error states

Do not blindly copy generic SaaS dashboard patterns.

---

# 14. Accessibility

Target WCAG 2.2 AA principles for the frontend.

Consider:

- Keyboard navigation
- Focus management
- Screen-reader semantics
- Labels
- Accessible forms
- Accessible dialogs
- Color contrast
- Touch targets
- Error messaging
- Reduced motion
- Responsive behavior

Accessibility is part of implementation, not a final polish step.

---

# 15. Backend Architecture

Backend uses:

- Node.js
- TypeScript
- Express

Organize backend code by business domain rather than by arbitrary technical categories alone.

A domain module may contain cohesive:

- Routes
- Controllers
- Schemas
- Services/use cases
- Repository/data access
- Types

Do not force every module to contain every layer.

Only create a layer when it represents a meaningful responsibility.

Controllers should remain thin.

Business rules belong in appropriate application/domain modules.

Persistence concerns must remain isolated from business logic.

---

# 16. API Design

Use a consistent versioned API.

Example:

/api/v1/auth
/api/v1/customers
/api/v1/services
/api/v1/bookings
/api/v1/staff

API boundaries must:

1. Validate input.
2. Authenticate where required.
3. Authorize the requested operation.
4. Execute business logic.
5. Return consistent responses.
6. Handle expected errors explicitly.
7. Avoid leaking sensitive information.

Do not expose internal database structures as an accidental API contract.

API behavior should be documented.

---

# 17. Validation

Validate untrusted data at system boundaries.

Validate:

- Request bodies
- Query parameters
- Path parameters
- Uploaded files
- External service responses where appropriate
- Configuration

Prefer a shared validation strategy.

Do not duplicate identical validation rules across multiple layers without reason.

Validation must not replace authorization.

---

# 18. Authentication and Authorization

Authentication and authorization are separate concerns.

Authentication answers:

"Who is this user?"

Authorization answers:

"Can this user perform this action on this resource?"

Use least privilege.

Never assume that being authenticated means a user can access every resource.

Customer, staff and admin permissions must be explicitly controlled.

Sensitive operations should have appropriate auditability.

Never store long-lived authentication tokens insecurely in browser localStorage merely for convenience.

Never hardcode credentials, tokens or secrets.

---

# 19. Healthcare Data Protection

Treat customer and healthcare-related information as sensitive.

Never expose sensitive information through:

- Console logs
- Debug output
- URLs
- Client-side analytics
- Error messages
- Source control
- Telemetry attributes

Do not log complete request bodies or customer records.

Use data minimization.

Only collect and expose information required for the operation.

Use least-privilege access.

Security and privacy decisions must be documented when architecturally significant.

---

# 20. Database

Production database target:

PostgreSQL.

Database design must consider:

- Foreign keys
- Unique constraints
- Check constraints
- Indexes
- Transactions
- Concurrency
- Referential integrity
- Appropriate deletion strategy
- Audit history

Do not rely exclusively on application code for critical invariants.

Avoid N+1 queries.

Do not introduce caching before understanding the actual access pattern.

Database migrations must be explicit and reproducible.

Never modify production schema manually when the project migration system should own the change.

---

# 21. Booking and Concurrency

Booking is a business-critical workflow.

Availability checks must account for concurrent requests.

Do not rely on:

"Check availability, then insert"

without considering race conditions.

Use appropriate database transactions, constraints or locking strategies.

A successful booking must maintain business invariants.

Important booking state transitions should be explicit and auditable.

---

# 22. Redis and Background Jobs

Redis may be used where there is a demonstrated need for:

- Caching
- Rate limiting
- Short-lived locks
- Temporary state
- Queue infrastructure

Do not cache everything.

Background jobs should be used for work that does not need to block the primary request, such as:

- Email
- Notifications
- WhatsApp messages
- Non-critical analytics processing
- Other asynchronous work

Business-critical database changes must complete transactionally before dependent asynchronous work is considered successful.

---

# 23. Error Handling

Errors must be explicit and useful.

Never silently swallow errors.

Preserve meaningful error causes and context.

Do not expose internal stack traces or sensitive implementation details to end users.

Expected business outcomes should be modeled clearly rather than thrown as generic exceptions.

API errors should follow a consistent structure.

---

# 24. Logging and Observability

Use structured logging.

Do not use random console.log statements as the application's production logging strategy.

Logs must avoid sensitive data.

Important requests should be traceable through a request/correlation ID.

The system should eventually support:

- Structured logs
- Error monitoring
- Metrics
- Tracing
- Health checks

Observability should help answer:

"What happened, when, where and why?"

---

# 25. Testing

Testing is part of implementation.

Tests must focus on behavior and business rules rather than implementation details.

Use an appropriate combination of:

- Unit tests
- Integration tests
- End-to-end tests
- Regression tests

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

Do not weaken, skip or delete a failing test merely to make CI green.

Do not write tests purely to increase coverage numbers.

Tests must be deterministic.

---

# 26. Security

Use OWASP security principles as the baseline.

Pay particular attention to:

- Authentication
- Authorization
- Session management
- Input validation
- Injection prevention
- XSS
- CSRF where applicable
- Secure headers
- Secrets
- File handling
- API security
- Access control
- Sensitive data exposure
- Dependency security
- Logging

Security-sensitive changes require additional verification.

---

# 27. Dependencies

Do not install a dependency for a trivial convenience.

Before adding a package:

1. Check whether the existing stack already solves the problem.
2. Check whether the functionality is small enough to implement safely without a dependency.
3. Consider maintenance, security, bundle/runtime impact and licensing.
4. Add the dependency only when it provides meaningful value.

Avoid multiple libraries solving the same problem.

---

# 28. Performance

Performance is part of design.

Consider:

- Database queries
- N+1 behavior
- API latency
- Rendering strategy
- Bundle size
- Images
- Caching
- Network requests
- Mobile performance

Do not prematurely optimize based on guesses.

Measure before introducing complex performance infrastructure unless the risk is obvious.

---

# 29. SEO

Public-facing pages should be designed for search visibility.

Consider:

- Metadata
- Open Graph
- Canonical URLs
- Sitemap
- Robots
- Structured data
- Semantic HTML
- Internal linking
- Image optimization
- Core Web Vitals

Do not create large numbers of low-value SEO pages.

Every public page should have meaningful, useful content.

---

# 30. Documentation

Document significant architectural decisions.

Use Architecture Decision Records where appropriate.

Important documentation should explain:

- Why a decision was made
- Alternatives considered
- Trade-offs
- Consequences

Do not document obvious implementation details merely for the sake of documentation.

Documentation must stay consistent with actual behavior.

---

# 31. Git and Changes

Keep changes focused.

Do not mix:

- Feature work
- Unrelated refactoring
- Formatting entire repositories
- Dependency upgrades
- Unrelated bug fixes

in one change unless explicitly requested.

Review the final diff before considering work complete.

Never commit:

- Secrets
- Credentials
- Local environment files
- Debug dumps
- Temporary files
- Generated junk

---

# 32. Phase Gating

This project is developed in explicit phases.

Do not implement multiple major phases without approval.

At the end of every major phase:

1. Explain what was implemented.
2. Explain important architectural decisions.
3. Explain how it was verified.
4. Explain how it can be tested.
5. List known issues.
6. List decisions requiring review.
7. STOP.

Do not silently continue into the next major phase.

---

# 33. Definition of Done

A meaningful feature is not complete merely because it works manually.

Before declaring a feature complete, verify where applicable:

- Existing code was inspected.
- Existing functionality was reused or intentionally refactored.
- No duplicate implementation was introduced.
- No obsolete implementation remains.
- No dead code remains.
- Architecture remains coherent.
- TypeScript passes.
- Linting passes.
- Formatting passes.
- Relevant tests pass.
- Error states are handled.
- Loading states are handled.
- Empty states are handled.
- Authorization is verified.
- Sensitive data is not exposed.
- Accessibility has been considered.
- Responsive behavior has been considered.
- SEO has been considered for public pages.
- No unnecessary dependency was introduced.
- Production build succeeds.
- Final diff has been reviewed.
- Documentation is updated when necessary.

Only claim verification that was actually performed.

---

# 34. Final Self-Review Before Finishing

Before completing a task, ask:

1. Did I search for existing functionality first?
2. Did I accidentally create duplicate business logic?
3. Did I leave the previous implementation behind?
4. Did I introduce unnecessary abstraction?
5. Could this be simpler without losing correctness?
6. Is the responsibility in the correct module?
7. Is there a second source of truth?
8. Are names clear?
9. Are errors handled correctly?
10. Are security and authorization boundaries correct?
11. Are meaningful tests present?
12. Did I verify the change with real commands?
13. Did I inspect the final diff?
14. Did I make unrelated changes?

If the implementation can be made substantially simpler while preserving correctness, prefer the simpler design.

---

# 35. Skill Usage

For UI/UX work, always read:

.opencode/skills/frontend-design/SKILL.md

For code implementation, editing, refactoring or cleanup, follow:

.opencode/skills/clean-code/SKILL.md

For module and interface design, follow:

.opencode/skills/codebase-design/SKILL.md

For architectural boundary and dependency decisions, follow:

.opencode/skills/clean-architecture/SKILL.md

For simplicity, refactoring, KISS, YAGNI and code-smell decisions, follow:

.opencode/skills/kent-beck-style/SKILL.md

Do not blindly apply every skill to every task.

Use the skill relevant to the current problem.

When skills appear to conflict, prefer:

1. Project-specific requirements
2. Explicit user requirements
3. Security/correctness
4. Existing architectural decisions
5. Simplicity and maintainability

---

# 36. Project Start Rule

The repository currently contains engineering configuration but no application implementation.

Before writing application code:

1. Understand the product requirements.
2. Produce the architecture proposal.
3. Define the major domains.
4. Define frontend/backend boundaries.
5. Define the initial database model.
6. Define authentication and authorization strategy.
7. Define API boundaries.
8. Identify major risks.
9. Identify decisions that require user approval.
10. STOP for approval.

Do not begin implementation merely because the repository is empty.

---

# 37. Most Important Rule

Optimize for software that a strong human engineering team would be comfortable inheriting.

Do not optimize for:

- Number of files
- Number of abstractions
- Number of classes
- Number of patterns
- Number of dependencies
- Number of lines
- Speed of initial generation

Optimize for:

- Correctness
- Clarity
- Cohesion
- Maintainability
- Security
- Testability
- Appropriate scalability
- Developer experience
- User experience

A smaller correct solution is better than a larger impressive-looking solution.

A robust system is not necessarily a complicated system.
