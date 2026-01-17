---
name: Frontend Specialist
description: Design and implement user interfaces
status: unfilled
generated: 2026-01-17
---

# Frontend Specialist Agent Playbook

## Mission
Describe how the frontend specialist agent supports the team and when to engage it.

## Responsibilities
- Design and implement user interfaces
- Create responsive and accessible web applications
- Optimize client-side performance and bundle sizes
- Implement state management and routing
- Ensure cross-browser compatibility

## Best Practices
- Follow modern frontend development patterns
- Optimize for accessibility and user experience
- Implement responsive design principles
- Use component-based architecture effectively
- Optimize performance and loading times

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `public/` — TODO: Describe the purpose of this directory.
- `src/` — TODO: Describe the purpose of this directory.
- `supabase/` — TODO: Describe the purpose of this directory.

## Key Files
**Entry Points:**
- [`supabase\functions\admin-update-user\index.ts`](supabase\functions\admin-update-user\index.ts)
- [`src\main.tsx`](src\main.tsx)

## Architecture Context

### Config
Configuration and constants
- **Directories**: `.`, `src\hooks`
- **Symbols**: 2 total
- **Key exports**: [`useSiteSettings`](src\hooks\useSiteSettings.ts#L8)

### Utils
Shared utilities and helpers
- **Directories**: `src\lib`
- **Symbols**: 1 total
- **Key exports**: [`cn`](src\lib\utils.ts#L4)

### Repositories
Data access and persistence
- **Directories**: `src\data`
- **Symbols**: 5 total
- **Key exports**: [`Category`](src\data\mockData.ts#L9), [`PropertyImage`](src\data\mockData.ts#L17), [`Property`](src\data\mockData.ts#L24), [`Lead`](src\data\mockData.ts#L65), [`User`](src\data\mockData.ts#L77)

### Components
UI components and views
- **Directories**: `src\components\ui`, `src\pages`, `src\components`, `src\pages\admin`, `src\components\layout`, `src\components\admin`
- **Symbols**: 59 total
- **Key exports**: [`WhatsAppButton`](src\components\WhatsAppButton.tsx#L8), [`SEO`](src\components\SEO.tsx#L13), [`CategoryCard`](src\components\CategoryCard.tsx#L21), [`AdminResetPasswordPage`](src\pages\admin\AdminResetPasswordPage.tsx#L20), [`AdminPropertiesPage`](src\pages\admin\AdminPropertiesPage.tsx#L44), [`AdminLeadsPage`](src\pages\admin\AdminLeadsPage.tsx#L38), [`Toaster`](src\components\ui\toaster.tsx#L4), [`TextareaProps`](src\components\ui\textarea.tsx#L5), [`ChartConfig`](src\components\ui\chart.tsx#L9), [`CalendarProps`](src\components\ui\calendar.tsx#L8), [`ButtonProps`](src\components\ui\button.tsx#L33), [`BadgeProps`](src\components\ui\badge.tsx#L23), [`Layout`](src\components\layout\Layout.tsx#L6), [`Footer`](src\components\layout\Footer.tsx#L5)
## Key Symbols for This Agent
- [`useSiteSettings`](src\hooks\useSiteSettings.ts#L8) (function)
- [`useProperties`](src\hooks\useProperties.ts#L58) (function)
- [`useFeaturedProperties`](src\hooks\useProperties.ts#L95) (function)
- [`usePropertyBySlug`](src\hooks\useProperties.ts#L134) (function)
- [`useRelatedProperties`](src\hooks\useProperties.ts#L169) (function)
- [`useCategories`](src\hooks\useCategories.ts#L14) (function)
- [`useCategoryBySlug`](src\hooks\useCategories.ts#L29) (function)
- [`useCategoryPropertyCount`](src\hooks\useCategories.ts#L48) (function)
- [`useToast`](src\hooks\use-toast.ts#L166) (function)
- [`useAuth`](src\hooks\useAuth.tsx#L145) (function)
- [`useIsMobile`](src\hooks\use-mobile.tsx#L5) (function)
- [`useSidebar`](src\components\ui\sidebar.tsx#L34) (function)
- [`useChart`](src\components\ui\chart.tsx#L22) (function)
- [`useCarousel`](src\components\ui\carousel.tsx#L31) (function)

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes

Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.
