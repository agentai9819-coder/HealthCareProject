# Veridian Care — Engineering Guidelines (Karpathy Rails)

## Core Principles
1. **Think Before Coding**: Explicitly state assumptions. Clarify ambiguities instead of silently guessing.
2. **Simplicity First**: Implement the minimum code needed to solve the problem cleanly (KISS / YAGNI). No speculative abstractions or unneeded helper wrappers.
3. **Surgical Changes**: Touch ONLY the relevant files and lines. Do not reformat unrelated code or perform unrequested refactoring.
4. **Goal-Driven Verification**: Define success criteria upfront and verify with real execution (`npm test`, `npm run typecheck`, `npm run build`).

## Monorepo Architecture
- **Web App**: Next.js 15 (App Router, React 18, TypeScript, CSS modules/inline tokens).
- **API App**: Express, Node.js 20, TypeScript, PostgreSQL (`pg`), BcryptJS.
- **Packages**:
  - `packages/types`: Shared TypeScript interfaces and roles.
  - `packages/validation`: Zod schemas (Indian 6-digit PIN, Indian mobile formats, auth/booking schemas).
  - `packages/config`: Environment schema and validation.

## Key Development Commands
```bash
# Automated 7-Step Security & Verification Suite
npm test

# Monorepo Strict TypeScript Check
npm run typecheck

# Production Build Check
npm run build

# Start Local Dev Servers
npm run dev           # Backend on port 3001
npm run web:dev       # Frontend on port 3000/3002
```
