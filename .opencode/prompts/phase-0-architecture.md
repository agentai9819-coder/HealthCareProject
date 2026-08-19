\# Phase 0 — Home Healthcare Platform Architecture Discovery



You are the lead senior software architect and principal engineer for this project.



Before doing anything, read and follow:



\- AGENTS.md

\- .opencode/skills/frontend-design/SKILL.md

\- .opencode/skills/clean-code/SKILL.md

\- .opencode/skills/codebase-design/SKILL.md

\- .opencode/skills/clean-architecture/SKILL.md

\- .opencode/skills/kent-beck-style/SKILL.md



Use only the skills relevant to each decision.



\---



\## PROJECT GOAL



We are building a production-quality home healthcare platform.



This is NOT an AI proof of concept.



This is NOT a throwaway demo.



The goal is software that a strong human engineering team could inherit, maintain, test, secure and extend.



The system should be:



\- robust

\- readable

\- maintainable

\- secure

\- testable

\- accessible

\- performant

\- appropriately scalable

\- easy to understand

\- resistant to AI-generated technical debt



Robustness must come from good design, clear boundaries, validation, database integrity and testing — NOT unnecessary complexity.



\---



\# CURRENT REPOSITORY STATE



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



\---



\# TARGET TECHNOLOGY



The initial technology direction is:



Frontend:

\- Next.js

\- React

\- TypeScript



Backend:

\- Node.js

\- Express

\- TypeScript



Database:

\- PostgreSQL



Potential infrastructure:

\- Redis

\- background jobs/queue

\- object/file storage



These are architectural candidates, not reasons to blindly add infrastructure.



Every technology must have a clear justification.



\---



\# ARCHITECTURE DIRECTION



The initial architecture should be a MODULAR MONOLITH.



Do NOT design a microservices architecture for the initial system.



The architecture should provide:



\- strong domain boundaries

\- clear ownership

\- high cohesion

\- low coupling

\- deep modules

\- small meaningful interfaces

\- clear dependency direction

\- testability

\- maintainability



Potential business domains include:



\- authentication

\- users

\- customers

\- staff

\- services

\- addresses

\- bookings

\- leads

\- notifications

\- analytics

\- administration



These are candidates only.



Determine the correct boundaries from the actual product requirements.



Do not create modules merely to increase the number of folders.



\---



\# PRODUCT



The platform will eventually support:



\## Public Website



Healthcare service discovery and business information.



Potential areas:



\- Home

\- Services

\- Individual service pages

\- About

\- Contact

\- Locations where applicable

\- FAQs/resources where justified



\## Customer Portal



Customers should eventually be able to:



\- create an account

\- authenticate

\- manage their profile

\- manage addresses

\- browse services

\- select services

\- select appointment times

\- create bookings

\- view booking history

\- view booking status

\- manage appropriate booking actions

\- receive relevant notifications



\## Staff Portal



Staff should eventually be able to:



\- authenticate

\- view assigned work

\- view schedules

\- manage availability where authorized

\- accept/manage assignments

\- update booking/visit status

\- view information necessary to perform assigned work



\## Admin / Operations Portal



Administrators should eventually be able to:



\- manage customers

\- manage staff

\- manage services

\- manage bookings

\- assign staff

\- manage leads

\- monitor operations

\- manage appropriate configuration

\- review audit information

\- view operational reporting



Do not invent business rules where requirements are ambiguous.



Clearly identify assumptions.



\---



\# CORE BUSINESS WORKFLOW



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



\- cancellation

\- rescheduling

\- failed booking

\- unavailable staff

\- unavailable appointment slot

\- concurrent booking attempts

\- notification failure

\- staff reassignment

\- administrative intervention



Do not invent final business rules without identifying them as assumptions or open decisions.



\---



\# BOOKING CONCURRENCY



Booking is a business-critical workflow.



Analyze race conditions.



Do not assume this is safe:



1\. Check availability

2\. Insert booking



Consider:



\- database transactions

\- constraints

\- locking where justified

\- slot ownership

\- idempotency

\- concurrent requests



Recommend the simplest robust mechanism.



Do not introduce Redis locks automatically if PostgreSQL can provide the required guarantee safely.



\---



\# FRONTEND ARCHITECTURE



The frontend should use Next.js + React + TypeScript.



Analyze:



\- route structure

\- public vs authenticated areas

\- customer portal

\- staff portal

\- admin portal

\- shared UI

\- state management

\- server/client boundaries

\- API communication

\- form handling

\- validation

\- error/loading/empty states

\- accessibility

\- responsive behavior

\- SEO



For UI/UX decisions follow:



.opencode/skills/frontend-design/SKILL.md



The product must feel like a trustworthy healthcare platform, not a generic SaaS template.



\---



\# BACKEND ARCHITECTURE



Analyze a domain-oriented modular monolith.



Determine appropriate responsibilities for:



\- routes

\- controllers

\- application/use-case logic

\- domain/business logic

\- persistence/data access

\- validation

\- infrastructure

\- external integrations



Do NOT force every domain into identical layers.



Only introduce a layer when it represents meaningful responsibility.



Controllers should remain thin.



Business rules should have clear ownership.



Infrastructure should not leak throughout the business logic.



\---



\# DATABASE



PostgreSQL is the primary database.



Design a proposed conceptual data model.



Consider likely entities such as:



\- users

\- roles

\- customers

\- customer addresses

\- staff

\- staff availability

\- services

\- service categories

\- bookings

\- booking assignments

\- booking status history

\- leads

\- notifications

\- audit logs



These are candidates.



Determine the actual model.



For each major entity explain:



\- responsibility

\- important relationships

\- important constraints

\- important indexes

\- lifecycle considerations



Pay particular attention to booking integrity.



\---



\# AUTHENTICATION AND AUTHORIZATION



Design authentication and authorization separately.



Analyze:



\- customer authentication

\- staff authentication

\- admin authentication

\- sessions/tokens

\- password security

\- password reset

\- role-based access

\- resource-level authorization

\- least privilege

\- session revocation

\- auditability



Do not assume authenticated users can access all resources.



Explain how authorization decisions should be enforced.



\---



\# SECURITY AND HEALTHCARE DATA



Treat customer and healthcare-related information as sensitive.



Use OWASP ASVS principles as the security baseline.



Analyze:



\- authentication

\- authorization

\- session security

\- input validation

\- injection prevention

\- XSS

\- CSRF where applicable

\- secure headers

\- secrets

\- logging

\- error handling

\- sensitive data exposure

\- dependency security

\- auditability

\- data minimization



Never expose sensitive information in:



\- logs

\- URLs

\- analytics

\- telemetry

\- error messages

\- debug output



\---



\# API ARCHITECTURE



Use a versioned REST API.



Analyze appropriate API boundaries.



Potential examples:



/api/v1/auth

/api/v1/customers

/api/v1/services

/api/v1/bookings

/api/v1/staff

/api/v1/leads



Do not blindly use these endpoints.



Determine the actual API structure.



Analyze:



\- validation

\- authentication

\- authorization

\- request/response contracts

\- error format

\- idempotency

\- pagination

\- filtering

\- sorting

\- API documentation



Do not accidentally expose the database schema as the API contract.



\---



\# TESTING STRATEGY



Design an appropriate testing pyramid.



Consider:



\- unit tests

\- integration tests

\- end-to-end tests

\- authorization tests

\- business workflow tests

\- concurrency tests

\- regression tests



Prioritize meaningful workflows.



Do not optimize for test count alone.



Tests should validate behavior rather than implementation details.



\---



\# OBSERVABILITY



Design an appropriate observability strategy.



Consider:



\- structured logging

\- request/correlation IDs

\- error monitoring

\- metrics

\- tracing

\- health checks



Sensitive information must never appear in logs or telemetry.



\---



\# REDIS / BACKGROUND JOBS



Evaluate whether Redis is actually needed initially.



If recommended, explain exactly why.



Potential uses:



\- caching

\- rate limiting

\- temporary state

\- locks

\- queue infrastructure



Do not introduce Redis merely because it is common.



Similarly evaluate background jobs for:



\- email

\- WhatsApp

\- notifications

\- non-critical asynchronous processing



Keep transactional business operations synchronous where required for correctness.



\---



\# SEO



Analyze SEO architecture for the public website.



Consider:



\- metadata

\- sitemap

\- robots

\- canonical URLs

\- Open Graph

\- structured data

\- semantic HTML

\- internal linking

\- image optimization

\- Core Web Vitals

\- location/service pages where genuinely valuable



Avoid mass-producing low-value SEO pages.



\---



\# ACCESSIBILITY



Target WCAG 2.2 AA principles.



Analyze:



\- keyboard navigation

\- focus management

\- semantic HTML

\- screen readers

\- forms

\- dialogs

\- contrast

\- touch targets

\- errors

\- responsive design

\- reduced motion



\---



\# PERFORMANCE



Analyze performance risks early.



Consider:



\- database queries

\- N+1 queries

\- API latency

\- rendering strategy

\- bundle size

\- images

\- network requests

\- mobile performance

\- caching



Do not introduce complex optimization without justification.



\---



\# CODE QUALITY



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



\- duplicate implementations

\- stale code

\- dead code

\- unnecessary abstractions

\- unnecessary wrappers

\- unnecessary interfaces

\- generic utility dumping grounds

\- giant functions

\- giant components

\- premature generalization

\- unnecessary dependencies



Every business rule must have one authoritative owner.



\---



\# PROJECT STRUCTURE



Propose the complete repository structure.



Consider:



\- apps

\- packages

\- database

\- docs

\- tests

\- infrastructure

\- CI/CD



But do NOT blindly use a monorepo if it adds unnecessary complexity.



Evaluate whether the project actually benefits from:



\- pnpm

\- Turborepo

\- shared packages



Explain the decision.



\---



\# DOCUMENTATION



Propose documentation structure for:



\- architecture

\- API

\- database

\- security

\- development

\- deployment

\- runbooks

\- architecture decisions



Use ADRs where appropriate.



\---



\# CI/CD



Design the eventual CI/CD pipeline.



Consider:



\- install

\- lint

\- format check

\- typecheck

\- unit tests

\- integration tests

\- security checks

\- build

\- E2E tests where appropriate



Do not implement it during Phase 0.



\---



\# IMPORTANT: SELF-CRITIQUE



After producing the initial architecture, challenge it.



Look for:



\- unnecessary layers

\- unnecessary modules

\- unnecessary packages

\- unnecessary infrastructure

\- premature microservices

\- premature Redis

\- premature queues

\- duplicate sources of truth

\- weak module boundaries

\- circular dependencies

\- shallow modules

\- overly large modules

\- security gaps

\- authorization gaps

\- database integrity gaps

\- booking race conditions

\- testing gaps

\- accessibility gaps

\- SEO gaps

\- operational gaps



Simplify the architecture where possible.



The final architecture should be the SIMPLEST architecture that is robust enough for the actual requirements.



\---



\# OUTPUT REQUIRED



Create NO application code.



Create NO scaffold.



Create NO database migrations.



Create NO components.



Create NO API endpoints.



Create NO package installation.



You may inspect the repository and existing configuration/skills.



Provide a detailed Phase 0 architecture proposal containing:



1\. Product understanding

2\. Users and roles

3\. Core workflows

4\. Domain boundaries

5\. Modular monolith architecture

6\. Repository/project structure

7\. Frontend architecture

8\. Backend architecture

9\. Dependency direction

10\. Database conceptual model

11\. Booking lifecycle

12\. Booking concurrency strategy

13\. Authentication strategy

14\. Authorization strategy

15\. API architecture

16\. Validation strategy

17\. Error handling

18\. Audit strategy

19\. Notification/background-job strategy

20\. Redis decision

21\. Security architecture

22\. Healthcare data protection

23\. Accessibility strategy

24\. SEO strategy

25\. Performance strategy

26\. Testing strategy

27\. CI/CD strategy

28\. Observability strategy

29\. Documentation strategy

30\. Development environment

31\. Deployment considerations

32\. Major risks

33\. Trade-offs

34\. What we deliberately will NOT build yet

35\. Assumptions

36\. Open questions



For every important decision distinguish:



CONFIRMED REQUIREMENT

ARCHITECTURAL RECOMMENDATION

ASSUMPTION

OPEN DECISION



Do not invent business requirements silently.



\---



\# PHASE GATE



This is Phase 0 only.



When finished:



STOP.



Do not implement anything.



Do not continue to Phase 1.



End the response with exactly:



PHASE 0 COMPLETE — WAITING FOR APPROVAL.



Then wait for explicit approval from me.

