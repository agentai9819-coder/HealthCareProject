---
name: production-web-craft-and-security
description: Master Engineering & Design Blueprint for building Zero-Vulnerability, High-Craft, Anti-AI-Slop, Production-Ready Web Applications on 100% Free Hosting Tiers.
---

# Master Production Web Craft & Security Playbook

This skill encapsulates all architectural patterns, security defenses, design craft rules, and verification automation refined across enterprise-grade full-stack web platforms. Use this playbook when starting ANY new web project to avoid repeating boilerplate research, security audits, or UI redesigns.

---

## 📁 Blueprint Contents & Quick Links

1. [01. Complete Security & Hardening Playbook](file:///c:/Users/dell/Documents/myproject/skills-and-instructions/01-SECURITY-AND-HARDENING.md)
   - Express Security Headers (CSP, HSTS, Permissions-Policy, Helmet)
   - Multi-Tier Rate Limiting (Registration, Auth, Export, AI, API)
   - Anti-Bot & Malicious Scanner Blocking (`botDetectionMiddleware`)
   - HTTPS Transport Enforcement & Request ID Correlation
   - Structured JSON Security Logger with PII / Healthcare Data Redaction
   - Input Validation, XSS Sanitization & Formula Injection Defense (CWE-1236)
   - IDOR / Multi-Tenant Ownership & Server-Side Pricing Invariants
   - Login Timing Attack & Account Enumeration Defense (DUMMY_HASH)
   - Account Lockout & Brute-Force Defense (DB attempt counters)
   - Webhook Cryptographic Signature Verification (HMAC / Stripe / Razorpay)
   - Safe File Uploads, MIME Whitelisting & Path Traversal Defense
   - AI / LLM Guardrails, Token Cost Caps & Prompt Injection Sanitization
   - Production Source Map & Debug Output Disabling
   - PostgreSQL Strict TLS Peer Verification
   - Package CVE Overrides (`zod`, `uuid`, `sharp`, `raw-body`, `body-parser`)
   - Vercel & Reverse-Proxy Security Headers Configuration
   - **Full 40-Point Pre-Launch Security Checklist** (copy & tick before every launch)

2. [02. Anti-AI-Slop UI/UX & Motion Engineering](file:///c:/Users/dell/Documents/myproject/skills-and-instructions/02-DESIGN-AND-MOTION.md)
   - Emil Kowalski Motion Tokens (`cubic-bezier(0.16, 1, 0.3, 1)`)
   - Tactile Button & Card Physics (`scale(0.98)`, micro-elevation)
   - Taste Skill Anti-Slop Guidelines (No neon blur orbs, no repetitive generic CTAs)
   - Impeccable Style Spatial Precision (1px translucent glass borders, dark obsidian palette)
   - Accessible Contrast & Typography (Outfit / Plus Jakarta Sans)

3. [03. Modular Monorepo Full-Stack Architecture](file:///c:/Users/dell/Documents/myproject/skills-and-instructions/03-ARCHITECTURE-AND-MONOREPO.md)
   - Next.js 15 App Router + Node.js Express Backend
   - Shared Workspace Packages (`packages/types`, `packages/validation`, `packages/config`)
   - 100% Free Hosting Setup (Vercel Frontend + Serverless API + Neon/Supabase PostgreSQL)
   - Single Source of Truth Zod Validation

4. [04. SEO, Crawling & Google Indexing Mastery](file:///c:/Users/dell/Documents/myproject/skills-and-instructions/04-SEO-AND-INDEXING.md)
   - Dynamic `sitemap.ts` and `robots.ts`
   - Google Search Console HTML verification tag injection
   - Structured JSON-LD Organization Schema
   - Social Share OpenGraph (`og:image`, `og:title`) metadata

5. [05. Automated Verification & Karpathy Engineering Rails](file:///c:/Users/dell/Documents/myproject/skills-and-instructions/05-VERIFICATION-AND-RAILS.md)
   - Full 12-Step Automated Verification Script (`scripts/verify-all.js`)
   - Individual Test Suite Templates (Auth, IDOR, Abuse Protection, Logging)
   - Andrej Karpathy Engineering Rules (Think before coding, surgical changes, no patch-on-patch)
   - Git commit & release standards

---

## ⚡ How to Initialize a New Project with this Skill

When prompting an AI assistant on a fresh repository, provide this one instruction:
> *"Load and follow all guidelines, security configurations, and design tokens from `skills-and-instructions/SKILL.md`."*

## 🔒 Security-First Workflow for Every New Project

1. Apply all items from **Section 1** before writing any business logic
2. Run `scripts/secret-scanner.js` after every env var change
3. Run `scripts/verify-all.js` before every git commit
4. Tick the 40-point checklist in `01-SECURITY-AND-HARDENING.md` before launch
