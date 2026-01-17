---
status: unfilled
generated: 2026-01-17
---

# Architecture Notes

Describe how the system is assembled and why the current design exists.

## System Architecture Overview

Summarize the top-level topology (monolith, modular service, microservices) and deployment model. Highlight how requests traverse the system and where control pivots between layers.

## Architectural Layers
### Config
Configuration and constants
- **Directories**: `.`, `src\hooks`
- **Symbols**: 2 total, 1 exported
- **Key exports**:
  - [`useSiteSettings`](src\hooks\useSiteSettings.ts#L8) (function)

### Utils
Shared utilities and helpers
- **Directories**: `src\lib`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`cn`](src\lib\utils.ts#L4) (function)

### Repositories
Data access and persistence
- **Directories**: `src\data`
- **Symbols**: 5 total, 5 exported
- **Key exports**:
  - [`Category`](src\data\mockData.ts#L9) (interface)
  - [`PropertyImage`](src\data\mockData.ts#L17) (interface)
  - [`Property`](src\data\mockData.ts#L24) (interface)
  - [`Lead`](src\data\mockData.ts#L65) (interface)
  - [`User`](src\data\mockData.ts#L77) (interface)

### Components
UI components and views
- **Directories**: `src\components\ui`, `src\pages`, `src\components`, `src\pages\admin`, `src\components\layout`, `src\components\admin`
- **Symbols**: 59 total, 14 exported
- **Key exports**:
  - [`WhatsAppButton`](src\components\WhatsAppButton.tsx#L8) (function)
  - [`SEO`](src\components\SEO.tsx#L13) (function)
  - [`CategoryCard`](src\components\CategoryCard.tsx#L21) (function)
  - [`AdminResetPasswordPage`](src\pages\admin\AdminResetPasswordPage.tsx#L20) (function)
  - [`AdminPropertiesPage`](src\pages\admin\AdminPropertiesPage.tsx#L44) (function)
  - [`AdminLeadsPage`](src\pages\admin\AdminLeadsPage.tsx#L38) (function)
  - [`Toaster`](src\components\ui\toaster.tsx#L4) (function)
  - [`TextareaProps`](src\components\ui\textarea.tsx#L5) (interface)
  - [`ChartConfig`](src\components\ui\chart.tsx#L9) (type)
  - [`CalendarProps`](src\components\ui\calendar.tsx#L8) (type)
  - [`ButtonProps`](src\components\ui\button.tsx#L33) (interface)
  - [`BadgeProps`](src\components\ui\badge.tsx#L23) (interface)
  - [`Layout`](src\components\layout\Layout.tsx#L6) (function)
  - [`Footer`](src\components\layout\Footer.tsx#L5) (function)


## Detected Design Patterns
- *No design patterns detected yet.*

## Entry Points
- [`supabase\functions\admin-update-user\index.ts`](supabase\functions\admin-update-user\index.ts)
- [`src\main.tsx`](src\main.tsx)

## Public API
| Symbol | Type | Location |
| --- | --- | --- |
| [`AdminLeadsPage`](src\pages\admin\AdminLeadsPage.tsx#L38) | function | src\pages\admin\AdminLeadsPage.tsx:38 |
| [`AdminPropertiesPage`](src\pages\admin\AdminPropertiesPage.tsx#L44) | function | src\pages\admin\AdminPropertiesPage.tsx:44 |
| [`AdminResetPasswordPage`](src\pages\admin\AdminResetPasswordPage.tsx#L20) | function | src\pages\admin\AdminResetPasswordPage.tsx:20 |
| [`AuthProvider`](src\hooks\useAuth.tsx#L21) | function | src\hooks\useAuth.tsx:21 |
| [`BadgeProps`](src\components\ui\badge.tsx#L23) | interface | src\components\ui\badge.tsx:23 |
| [`ButtonProps`](src\components\ui\button.tsx#L33) | interface | src\components\ui\button.tsx:33 |
| [`CalendarProps`](src\components\ui\calendar.tsx#L8) | type | src\components\ui\calendar.tsx:8 |
| [`Category`](src\hooks\useCategories.ts#L4) | interface | src\hooks\useCategories.ts:4 |
| [`Category`](src\data\mockData.ts#L9) | interface | src\data\mockData.ts:9 |
| [`CategoryCard`](src\components\CategoryCard.tsx#L21) | function | src\components\CategoryCard.tsx:21 |
| [`ChartConfig`](src\components\ui\chart.tsx#L9) | type | src\components\ui\chart.tsx:9 |
| [`cn`](src\lib\utils.ts#L4) | function | src\lib\utils.ts:4 |
| [`CompositeTypes`](src\integrations\supabase\types.ts#L464) | type | src\integrations\supabase\types.ts:464 |
| [`Database`](src\integrations\supabase\types.ts#L9) | type | src\integrations\supabase\types.ts:9 |
| [`Enums`](src\integrations\supabase\types.ts#L447) | type | src\integrations\supabase\types.ts:447 |
| [`Footer`](src\components\layout\Footer.tsx#L5) | function | src\components\layout\Footer.tsx:5 |
| [`formatArea`](src\hooks\useProperties.ts#L220) | function | src\hooks\useProperties.ts:220 |
| [`formatPrice`](src\hooks\useProperties.ts#L211) | function | src\hooks\useProperties.ts:211 |
| [`Json`](src\integrations\supabase\types.ts#L1) | type | src\integrations\supabase\types.ts:1 |
| [`Layout`](src\components\layout\Layout.tsx#L6) | function | src\components\layout\Layout.tsx:6 |
| [`Lead`](src\data\mockData.ts#L65) | interface | src\data\mockData.ts:65 |
| [`Property`](src\hooks\useProperties.ts#L11) | interface | src\hooks\useProperties.ts:11 |
| [`Property`](src\data\mockData.ts#L24) | interface | src\data\mockData.ts:24 |
| [`PropertyImage`](src\hooks\useProperties.ts#L4) | interface | src\hooks\useProperties.ts:4 |
| [`PropertyImage`](src\data\mockData.ts#L17) | interface | src\data\mockData.ts:17 |
| [`SEO`](src\components\SEO.tsx#L13) | function | src\components\SEO.tsx:13 |
| [`Tables`](src\integrations\supabase\types.ts#L368) | type | src\integrations\supabase\types.ts:368 |
| [`TablesInsert`](src\integrations\supabase\types.ts#L397) | type | src\integrations\supabase\types.ts:397 |
| [`TablesUpdate`](src\integrations\supabase\types.ts#L422) | type | src\integrations\supabase\types.ts:422 |
| [`TextareaProps`](src\components\ui\textarea.tsx#L5) | interface | src\components\ui\textarea.tsx:5 |
| [`Toaster`](src\components\ui\toaster.tsx#L4) | function | src\components\ui\toaster.tsx:4 |
| [`useAuth`](src\hooks\useAuth.tsx#L145) | function | src\hooks\useAuth.tsx:145 |
| [`useCategories`](src\hooks\useCategories.ts#L14) | function | src\hooks\useCategories.ts:14 |
| [`useCategoryBySlug`](src\hooks\useCategories.ts#L29) | function | src\hooks\useCategories.ts:29 |
| [`useCategoryPropertyCount`](src\hooks\useCategories.ts#L48) | function | src\hooks\useCategories.ts:48 |
| [`useFeaturedProperties`](src\hooks\useProperties.ts#L95) | function | src\hooks\useProperties.ts:95 |
| [`useIsMobile`](src\hooks\use-mobile.tsx#L5) | function | src\hooks\use-mobile.tsx:5 |
| [`useProperties`](src\hooks\useProperties.ts#L58) | function | src\hooks\useProperties.ts:58 |
| [`usePropertyBySlug`](src\hooks\useProperties.ts#L134) | function | src\hooks\useProperties.ts:134 |
| [`User`](src\data\mockData.ts#L77) | interface | src\data\mockData.ts:77 |
| [`useRelatedProperties`](src\hooks\useProperties.ts#L169) | function | src\hooks\useProperties.ts:169 |
| [`useSiteSettings`](src\hooks\useSiteSettings.ts#L8) | function | src\hooks\useSiteSettings.ts:8 |
| [`WhatsAppButton`](src\components\WhatsAppButton.tsx#L8) | function | src\components\WhatsAppButton.tsx:8 |

## Internal System Boundaries

Document seams between domains, bounded contexts, or service ownership. Note data ownership, synchronization strategies, and shared contract enforcement.

## External Service Dependencies

List SaaS platforms, third-party APIs, or infrastructure services the system relies on. Describe authentication methods, rate limits, and failure considerations for each dependency.

## Key Decisions & Trade-offs

Summarize architectural decisions, experiments, or ADR outcomes that shape the current design. Reference supporting documents and explain why selected approaches won over alternatives.

## Diagrams

Link architectural diagrams or add mermaid definitions here.

## Risks & Constraints

Document performance constraints, scaling considerations, or external system assumptions.

## Top Directories Snapshot
- `bun.lockb/` — approximately 1 files
- `components.json/` — approximately 1 files
- `docker-compose.yml/` — approximately 1 files
- `Dockerfile/` — approximately 1 files
- `eslint.config.js/` — approximately 1 files
- `index.html/` — approximately 1 files
- `nginx.conf/` — approximately 1 files
- `package-lock.json/` — approximately 1 files
- `package.json/` — approximately 1 files
- `plan.md/` — approximately 1 files
- `postcss.config.js/` — approximately 1 files
- `public/` — approximately 3 files
- `README.md/` — approximately 1 files
- `src/` — approximately 103 files
- `supabase/` — approximately 7 files
- `tailwind.config.ts/` — approximately 1 files
- `tsconfig.app.json/` — approximately 1 files
- `tsconfig.json/` — approximately 1 files
- `tsconfig.node.json/` — approximately 1 files
- `vite.config.ts/` — approximately 1 files

## Related Resources

- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.
