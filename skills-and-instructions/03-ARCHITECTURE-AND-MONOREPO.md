# 03. Modular Monorepo Full-Stack Architecture

This guide details the single-language, zero-cost, enterprise monorepo architecture.

---

## 1. Monorepo Directory Structure

```text
my-project/
├── apps/
│   ├── web/                    # Next.js 15 App Router (Frontend)
│   └── api/                    # Node.js + Express (Backend REST API)
├── packages/
│   ├── types/                  # Shared TypeScript interfaces & models
│   ├── validation/             # Shared Zod validation schemas
│   ├── config/                 # Environment variables & constants
│   └── ui/                     # Shared UI helpers & brand tokens
├── package.json                # npm workspaces root
└── vercel.json                 # Vercel deployment & security headers configuration
```

---

## 2. Shared Workspace Configuration

In root `package.json`:
```json
{
  "name": "enterprise-monorepo",
  "private": true,
  "workspaces": [
    "apps/api",
    "apps/web",
    "packages/types",
    "packages/validation",
    "packages/config",
    "packages/ui"
  ],
  "scripts": {
    "build": "npm run build --workspace=apps/web",
    "build:all": "npm run build --workspace=packages/types && npm run build --workspace=packages/validation && npm run build --workspace=packages/config && npm run build --workspace=apps/api && npm run build --workspace=apps/web",
    "dev": "npm run dev --workspace=apps/api & npm run dev --workspace=apps/web",
    "test": "node scripts/verify-all.js"
  }
}
```

---

## 3. 100% Free Cloud Infrastructure Map

| Component | Platform | Free Tier Capability |
|---|---|---|
| **Frontend (Next.js)** | **Vercel** | Unlimited deployments, global Edge CDN, free custom domains & SSL. |
| **Database** | **Neon / Supabase** | Serverless PostgreSQL (0.5GB free, instant branching, connection pooling). |
| **Backend API** | **Vercel Serverless / Render / Railway** | 750 free hours/month, automatic HTTPS. |
