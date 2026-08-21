# Andrej Karpathy Coding Guidelines

Derived from Andrej Karpathy's observations on common LLM coding pitfalls.

## Core Operational Discipline

### 1. Think Before Coding
- **State Assumptions Upfront**: If a prompt or requirement has multiple interpretations, state your intended approach and assumptions explicitly before modifying files.
- **Clarify Ambiguity**: If critical technical details are missing (e.g. schema types, API route signatures, specific third-party configurations), do not make silent guesses—clarify with the user.
- **Understand Existing Code**: Always inspect existing implementations, callers, and patterns across the workspace before writing new code.

### 2. Simplicity First (KISS & YAGNI)
- **Minimum Effective Code**: Write the simplest, highest-quality code necessary to solve the exact problem requested.
- **No Speculative Abstractions**: Avoid premature generalizations, unnecessary factory classes, wrapper chains, or helper layers for "future flexibility" that was not explicitly requested.
- **Zero-Cost & Native**: Favor standard language primitives and existing dependencies over adding new external packages.

### 3. Surgical Changes (Minimal Blast Radius)
- **Precise Edits**: Modify only the specific lines, functions, or files directly required to fulfill the task.
- **No Unrelated Churn**: Do not reformat whole files, rename unrelated variables, or modify adjacent working logic unless explicitly directed.
- **Preserve Conventions**: Match the existing architectural style, naming conventions, and file structures already established in the codebase.

### 4. Goal-Driven Verification
- **Define Done**: Establish clear success criteria before making code edits.
- **Test with Real Execution**: Never declare a task complete based on assumptions. Always run real verification commands:
  - `npm test` — Run all unit, security, and schema validation tests.
  - `npm run typecheck` — Verify zero TypeScript compilation errors across monorepo workspaces.
  - `npm run build` — Verify production bundle builds without errors.
- **Review Diff**: Review the final diff to ensure no dead code, debug statements, or accidental changes remain before committing.
