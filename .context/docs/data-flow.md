---
status: unfilled
generated: 2026-01-17
---

# Data Flow & Integrations

Explain how data enters, moves through, and exits the system, including interactions with external services.

## Module Dependencies
- **src\integrations\supabase\client.ts/** → `src\integrations\supabase\types.ts`
- **src\main.tsx/** → `src\App.tsx`, `src\index.css`
- **src\App.tsx/** → `src\pages\AboutPage.tsx`, `src\pages\AdvertisePage.tsx`, `src\pages\CategoriesPage.tsx`, `src\pages\ContactPage.tsx`, `src\pages\HomePage.tsx`, `src\pages\NotFound.tsx`, `src\pages\PropertiesPage.tsx`, `src\pages\PropertyDetailPage.tsx`, `src\pages\admin\AdminCategoriesPage.tsx`, `src\pages\admin\AdminDashboard.tsx`, `src\pages\admin\AdminLeadsPage.tsx`, `src\pages\admin\AdminLoginPage.tsx`, `src\pages\admin\AdminPropertiesPage.tsx`, `src\pages\admin\AdminPropertyFormPage.tsx`, `src\pages\admin\AdminResetPasswordPage.tsx`, `src\pages\admin\AdminSettingsPage.tsx`, `src\pages\admin\AdminUsersPage.tsx`
- **src\components\layout\Layout.tsx/** → `src\components\layout\Footer.tsx`, `src\components\layout\Header.tsx`
- **src\components\admin\AdminLayout.tsx/** → `src\components\admin\AdminNotifications.tsx`, `src\components\admin\AdminSidebar.tsx`

## Service Layer
- *No service classes detected.*

## High-level Flow

Summarize the primary pipeline from input to output. Reference diagrams or embed Mermaid definitions when available.

## Internal Movement

Describe how modules within `bun.lockb`, `components.json`, `docker-compose.yml`, `Dockerfile`, `eslint.config.js`, `index.html`, `nginx.conf`, `package-lock.json`, `package.json`, `plan.md`, `postcss.config.js`, `public`, `README.md`, `src`, `supabase`, `tailwind.config.ts`, `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts` collaborate (queues, events, RPC calls, shared databases).

## External Integrations

Document each integration with purpose, authentication, payload shapes, and retry strategy.

## Observability & Failure Modes

Describe metrics, traces, or logs that monitor the flow. Note backoff, dead-letter, or compensating actions when downstream systems fail.
