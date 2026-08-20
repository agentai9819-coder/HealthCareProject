# 🧠 BRAIN.MD — Home Healthcare Platform Knowledge Base

> **Primary Purpose**: This document serves as the persistent, single-source-of-truth knowledge base for AI coding assistants and engineers working on this repository. It encapsulates the complete architectural model, codebase topology, business invariants, performance guidelines, and troubleshooting history—eliminating the need to re-index or re-read the entire codebase for every change.

---

## 1. 🌐 Project Identity & Deployment

| Attribute | Specification |
|---|---|
| **Product Name** | **Veridian Care** (Home Healthcare Platform) |
| **Domain** | Luxury, hospital-grade in-home clinical care, nursing, physical therapy, and personalized recovery |
| **Pricing / Currency** | Indian Rupee (`₹` INR) across all services, fees, itemized receipts, and booking consoles |
| **Live Production URL** | [https://health-care-project-api-delta.vercel.app](https://health-care-project-api-delta.vercel.app) |
| **GitHub Repository** | `https://github.com/agentai9819-coder/HealthCareProject.git` (`main` branch) |
| **CI/CD Pipeline** | Automated Vercel deployments on push to `main` (Region: `iad1` Washington, D.C.) |
| **Node.js Engine** | `>=20.0.0` (Configured with Next.js 15 standalone output) |

---

## 2. 🏛 Architecture & Monorepo Structure

The project is structured as a **Modular Monolith** using npm workspaces.

```
├── apps/
│   ├── api/                     # Node.js + Express + TypeScript Backend API
│   │   └── src/
│   │       ├── modules/         # Domain Modules (Auth, Customers, Staff, Services, Bookings, Dispatch)
│   │       │   ├── auth/        # JWT Authentication, Session Management, Password Hashing
│   │       │   ├── customers/   # Patient Profiles, Medical History, Address Records
│   │       │   ├── staff/       # Clinician Registry, Licensing Verification, On-Call Status
│   │       │   ├── services/    # Clinical Service Catalog, Pricing, Durations
│   │       │   ├── bookings/    # Appointment Booking Engine, Concurrency Locking
│   │       │   └── dispatch/    # Clinical Dispatch Radar, Schedule Allocation
│   │       ├── infrastructure/  # DB Pools (PostgreSQL), Redis Connection, Logger
│   │       └── index.ts         # Express App Entrypoint & Route Mounting
│   │
│   └── web/                     # Next.js 15 (App Router) Luxury Frontend
│       └── src/
│           ├── app/             # App Router Pages & Layouts
│           │   ├── page.tsx     # Homepage (Hero, Booking Console, Clinicians, Pathways, FAQ)
│           │   ├── layout.tsx   # Root Layout with Font Injection, SEO Metadata, Global Headers/Footers
│           │   ├── globals.css  # Obsidian Glassmorphic Design System & Responsive Tokens
│           │   ├── auth/        # /auth/login, /auth/register
│           │   ├── services/    # /services directory & /services/[slug] dynamic detail pages
│           │   ├── booking/     # /booking/select-slot, /booking/confirm, /booking/view/[id]
│           │   ├── bookings/    # /bookings (Patient Appointment History & Portal)
│           │   ├── account/     # /account (Patient Profile & Details)
│           │   ├── staff/       # /staff/login, /staff/schedule (Clinician Operational Portal)
│           │   ├── admin/       # /admin/dispatch, /admin/staff (Command Center)
│           │   ├── how-it-works # /how-it-works
│           │   ├── why-us/      # /why-us
│           │   ├── about/       # /about
│           │   ├── faqs/        # /faqs
│           │   └── contact/     # /contact
│           ├── components/      # Modular UI Components
│           │   ├── Header.tsx           # Route-aware Header Switcher
│           │   ├── MarketingHeader.tsx  # Public Header + Animated Mobile Hamburger Drawer
│           │   ├── PortalHeader.tsx     # Operations Header for Staff/Admin
│           │   ├── MarketingFooter.tsx  # Emergency Disclaimer & Site Map
│           │   ├── CookieBanner.tsx     # HIPAA Essential Cookie Notice
│           │   ├── StickyMobileCta.tsx  # Floating Mobile Bottom Bar with Safe-Area Insets
│           │   └── marketing/           # HeroSection, ClinicianSection, WhoWeHelpSection, etc.
│           ├── lib/             # Utility Libraries (`api.ts`, `services.ts`, `booking-flow.ts`)
│           └── content/         # Structured Marketing Content & Static Catalogs
│
├── packages/
│   └── config/                  # Shared Configuration, TypeScript Models, Validation Schemas
├── sql/                         # PostgreSQL DDL & Migration Scripts (`001_init.sql`)
├── AGENTS.md                    # Engineering Constitution & Architectural Rules
└── BRAIN.md                     # Persistent AI Knowledge Base (This File)
```

---

## 3. 🎨 Design System & UI/UX Standards

The frontend follows the **Obsidian Glassmorphism** aesthetic tailored for high-trust luxury clinical services:

*   **Color Palette**:
    *   Canvas Background: `#080d0c` (Obsidian Onyx)
    *   Primary Accent: `#10b981` (Emerald Green)
    *   Secondary Accent: `#34d399` / `#6ee7b7` (Mint / Spring Jade)
    *   Borders / Glass Seams: `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.14)`
    *   Card Surfaces: `rgba(18, 30, 27, 0.75)` with subtle hardware-accelerated gradients
    *   Text: `#f8fafc` (Primary Crisp White), `#94a3b8` / `#98a49e` (Muted Clinical Slate)
*   **Typography**:
    *   Display / Headings: `Outfit` via `next/font/google` (`--font-display`)
    *   Body / Sans: `Plus Jakarta Sans` via `next/font/google` (`--font-sans`)
    *   Zero render-blocking external `<link>` tags.
*   **Accessibility & Contrast**:
    *   Strict WCAG 2.2 AA compliance (>4.5:1 text contrast).
    *   Minimum touch target sizes: `44px` on all interactive buttons and chips.

---

## 4. ⚡ Critical Performance Rules & Invariants

To guarantee **60–120 FPS buttery smooth scrolling** and **<50ms load times**:

1.  **Zero Infinite CSS Animation Loops**:
    *   Never use infinite keyframes with `filter: blur()`, `box-shadow`, or continuous transforms on multiple elements.
    *   Button shimmers (`.shimmer-button`) must trigger on `:hover` (`transition: transform 0.6s ease`) rather than running infinite background loops.
2.  **No `content-visibility: auto` on Dynamic Pages**:
    *   Do not add `content-visibility: auto` to below-the-fold sections without exact pre-computed intrinsic sizes, as it causes layout recalculations and scroll stutter.
3.  **Static Generation & 1-Hour ISR**:
    *   All public marketing and service pages (`/`, `/services`, `/services/[slug]`) specify `export const revalidate = 3600;`.
    *   Dynamic service routes include `generateStaticParams()` to pre-render pages at build time.
4.  **Zero-Delay SSR Fallbacks**:
    *   `getServicesCatalog()` in `apps/web/src/lib/services.ts` immediately returns `DEFAULT_SERVICES` when a live remote database/API is not responding within a 400ms timeout.
5.  **Image Optimization**:
    *   All images must use `next/image` with explicit `width`, `height`, `quality={85}`, and `loading="lazy"`.

---

## 5. 📱 Mobile-First Best Practices

1.  **iOS Safari Input Zoom Prevention**:
    *   `input, select, textarea` have `font-size: 16px !important;` on screens `< 768px` to prevent iOS Safari from auto-zooming into form fields on focus.
2.  **Mobile Navigation**:
    *   `MarketingHeader.tsx` includes an animated toggle (`.mobile-toggle-btn`) and a full-featured slide-down drawer (`.mobile-drawer`) containing all routes, auth actions, and the hotline.
3.  **Sticky Bottom Bar (`StickyMobileCta.tsx`)**:
    *   Uses `padding-bottom: max(10px, env(safe-area-inset-bottom))` to respect iPhone home indicators.
4.  **Universal Overflow Containment**:
    *   `html, body { overflow-x: hidden; max-width: 100vw; }` prevents horizontal page wobble.

---

## 6. 🔐 Authentication & Security Model

*   **Session Management**: Secure, HTTP-only, SameSite cookies (`jwt`). No authentication tokens are ever stored in client-side `localStorage`.
*   **Role Hierarchy**:
    *   `CUSTOMER`: Access to `/bookings`, `/account`, and direct appointment checkout.
    *   `STAFF`: Access to `/staff/schedule` (daily patient visit itinerary, clinical status).
    *   `ADMIN`: Access to `/admin/dispatch` (live radar board) and `/admin/staff` (credential vetting).
*   **API Validation**: Boundary input sanitization using shared Zod/schema validation (`packages/config`).
*   **Data Minimization**: Complete patient health records and password hashes are never logged to stdout or telemetry.

---

## 7. 🛠 Common Development & Verification Commands

```bash
# 1. Full Monorepo Typecheck (must pass with 0 errors)
npm run typecheck

# 2. Production Build Check
npm run build

# 3. Local Development Servers
npm run dev

# 4. Git Deployment Workflow (Pushing directly to Vercel Production)
.\scratch\mingit\cmd\git.exe add .
.\scratch\mingit\cmd\git.exe commit -m "feat/fix/perf(scope): description"
.\scratch\mingit\cmd\git.exe push origin main
```

---

## 8. 🚨 Solution Reference / Troubleshooting History

| Problem / Symptom | Root Cause | Solution Implemented |
|---|---|---|
| **Vercel Build Error (`tsc: not found`)** | `npm ci` excluded devDependencies in production monorepo workspaces | Added `npm install --include=dev` to Vercel root build script |
| **Last Name Input Overflowing Form** | Flexbox item without `min-width: 0` or `flex: 1 1 0%` inside modal card | Added `box-sizing: border-box`, `min-width: 0`, and `flex: 1 1 0%` to form styles |
| **Homepage Slow Load (2-3s delay)** | SSR fetch calling non-existent live API during server render | Created `getServicesCatalog()` with 0ms fallback to `DEFAULT_SERVICES` + `revalidate = 3600` |
| **Scroll Jitter / GPU Lag** | Infinite Gaussian blur animations (`filter: blur(40px)`) on 500px background orbs | Replaced with hardware-accelerated CSS radial gradients (`contain: strict; transform: translateZ(0);`) |
| **Scroll-Down Layout Stutter** | `content-visibility: auto` causing on-the-fly layout reflows during scrolling | Removed `content-visibility: auto` in favor of full upfront DOM pre-rendering |
| **Mobile Menu Missing** | Desktop nav links hidden without mobile drawer | Implemented animated mobile hamburger toggle and slide-down drawer with safe-area insets |
