# Phase 1 Final Correction Pass

Review the current Phase 1 foundation and correct ONLY the issues listed below.

Read first:
- AGENTS.md
- .opencode/prompts/CURRENT.md
- docs/CHANGELOG.md
- PHASE_1_AUDIT_SUMMARY.md
- all relevant skills in .opencode/skills/
- current package.json files
- current repository structure

IMPORTANT:
Do NOT start Phase 2.
Do NOT implement business features.
Do NOT create customer, staff, admin, booking, authentication or other domain functionality.
Do NOT create unnecessary abstractions.
Do NOT make unrelated changes.

The goal is to make Phase 1 foundation accurate, minimal, and compliant with the approved Phase 0 architecture.

==================================================
1. NODE.JS VERSION
==================================================

The current foundation uses:

node >= 20.0.0

Do NOT blindly keep this.

Verify the currently supported Node.js LTS version and its compatibility with the selected project stack.

For this new project, evaluate the current Node.js Active/Maintenance LTS options and select an appropriate currently supported LTS version.

Do not allow an EOL Node.js version through a broad >=20 constraint.

Update package.json only after verification.

Document:
- version selected
- why it was selected
- compatibility considerations

==================================================
2. NEXT.JS VERSION
==================================================

The current project uses:

next ^15.0.0

Do NOT describe Next.js 15 as the current Active LTS without verification.

Verify the currently supported Next.js versions.

Evaluate Next.js 16 versus Next.js 15 based on:
- current support status
- compatibility with the existing foundation
- React compatibility
- project requirements
- stability for a new production application

Select the appropriate currently supported version for this new project.

Do not upgrade blindly.

Document:
- version selected
- support status
- compatibility reasoning

==================================================
3. TURBO DECISION
==================================================

The root package scripts reference Turbo, but Turbo is not currently available.

Do NOT automatically install Turbo just to make commands pass.

First evaluate whether Turbo is actually justified for this repository.

Consider:
- npm workspaces already exist
- current repository size
- number of apps/packages
- task orchestration needs
- build/typecheck/lint/test requirements
- complexity introduced by Turbo
- KISS/YAGNI principles
- whether npm workspace commands are sufficient

Then make ONE explicit decision:

A. Keep Turbo and add it properly as a justified development dependency

OR

B. Remove Turbo and simplify the root scripts using npm workspaces

Choose the simpler robust solution based on the actual repository.

Do not leave the repository in a half-configured state where root scripts reference an unavailable tool.

After the decision, verify:
- npm run typecheck
- npm run lint
- npm run build

Use PowerShell-compatible commands.

Do not use Unix-only commands such as:
- head
- tail
- &&
- ||

==================================================
4. JWT CONFIGURATION
==================================================

Phase 0 deliberately did NOT select JWT authentication.

The current foundation contains premature JWT-specific configuration such as:

JWT_SECRET
JWT_EXPIRES_IN

Remove JWT-specific configuration from the foundation unless the repository contains an actual approved requirement that requires it.

Do NOT implement authentication.

Do NOT choose JWT.

Do NOT choose a session implementation yet.

The authentication mechanism remains a Phase 1 architectural decision to be made before authentication implementation.

After correction:
- no JWT secret should exist in frontend configuration
- no JWT-specific configuration should remain merely because it may be useful later
- do not create replacement authentication configuration speculatively

==================================================
5. CHANGELOG
==================================================

Update:

docs/CHANGELOG.md

Accurately record:
- what was changed
- why it was changed
- what was deliberately NOT changed
- verification results
- remaining open decisions
- any failed checks and their actual causes

Do not claim a check passed unless it actually passed.

Do not describe Node 20 as current LTS if it is not.

Do not describe Next.js 15 as Active LTS if it is not.

Clearly distinguish:
- implemented
- verified
- deferred
- failed
- open decision

==================================================
6. PHASE 1 AUDIT SUMMARY
==================================================

Update:

PHASE_1_AUDIT_SUMMARY.md

Produce a final audit of the current Phase 1 foundation.

Include:

1. Actual changes
2. Actual verification results
3. Failed verification
4. Architecture compliance
5. Security review
6. Premature decisions removed
7. Remaining open decisions
8. Deferred work
9. Final approval recommendation

The audit must reflect the actual repository state after this correction pass.

==================================================
7. ARCHITECTURAL CONSTRAINTS
==================================================

Preserve all approved Phase 0 principles:

- modular monolith
- PostgreSQL as transactional source of truth
- no microservices
- no package-per-domain
- no unnecessary domain modules before business functionality exists
- Next.js App Router
- Node.js currently supported LTS
- no premature PostgreSQL driver/ORM selection
- no premature authentication implementation
- no premature JWT decision
- Redis excluded unless a concrete requirement justifies it
- no speculative infrastructure
- no duplicate business logic
- no stale implementations
- no dead code
- no unnecessary abstractions
- no unnecessary wrappers
- refactor rather than layer patches
- deep modules with small interfaces
- KISS
- YAGNI
- security
- WCAG 2.2 AA
- testing
- observability
- SEO
- performance

==================================================
8. PHASE GATE
==================================================

This is still Phase 1 foundation correction.

Do NOT start business-feature implementation.

Do NOT start Phase 2.

Do NOT implement authentication.

Do NOT implement booking.

Do NOT implement customer/staff/admin workflows.

After completing the correction pass:

1. Explain exactly what changed.
2. Explain why each change was necessary.
3. Report commands actually executed.
4. Report which checks passed.
5. Report which checks failed.
6. Explain remaining open decisions.
7. State whether Phase 1 is ready for approval.

Do not claim full approval if any required foundation check remains unresolved.

End with exactly:

PHASE 1 FINAL CORRECTION COMPLETE — WAITING FOR APPROVAL.