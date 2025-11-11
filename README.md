# ERP UI Renderer

Schema-driven UI framework for ERP systems. Define screens with JSON schemas, render automatically.

## Features

- **Schema-driven UI**: Define screens with JSON, no code changes needed
- **Dynamic Tables**: AG Grid with server-side pagination, sorting, filtering
- **Smart Forms**: react-hook-form with Zod validation and conditional logic
- **Gantt Charts**: Timeline visualization with drag-and-drop
- **RBAC**: Role-based access control
- **i18n**: Multi-language support (EN/RU)
- **Theming**: Light/Dark mode
- **Full Testing**: Unit tests (Vitest) + E2E tests (Playwright)

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Clone repository
git clone <repo-url>
cd barauz

# Install dependencies
npm ci

# Run scaffold to create missing files
npm run scaffold

# Start development server
npm run dev
```

Visit http://localhost:5173

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run format       # Prettier check
npm run format:write # Prettier fix

# Schemas
npm run schema:validate   # Validate JSON schemas
npm run schema:gen-types  # Generate TypeScript types

# Testing
npm test            # Run unit tests
npm run e2e         # Run e2e tests
npm run e2e:ui      # Open Playwright UI

# CI
npm run ci:all      # Run all checks (CI pipeline)
```

## Project Structure

```
├── .github/workflows/     # CI/CD workflows
├── docs/                  # Documentation
│   ├── architecture.md
│   └── dsl.md
├── e2e/                   # E2E tests (Playwright)
├── packages/
│   ├── schemas/           # JSON Schema definitions
│   └── schema-types/      # Generated TypeScript types
├── public/                # Static assets
├── schemas/               # Example page schemas
│   ├── sales_orders.page.json
│   ├── mfg_gantt.page.json
│   └── rbac.json
├── src/
│   ├── app/               # Application shell
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── routes.tsx
│   │   ├── theme.ts
│   │   └── i18n.ts
│   ├── dsl/               # DSL types and validation
│   ├── runtime/           # Renderers
│   │   ├── PageRenderer.tsx
│   │   ├── TableRenderer.tsx
│   │   ├── FormRenderer.tsx
│   │   ├── GanttRenderer.tsx
│   │   └── widgets/
│   └── data/
│       ├── msw/           # Mock Service Worker
│       │   ├── handlers.ts
│       │   ├── seeds.ts
│       │   ├── browser.ts
│       │   └── server.ts
│       └── queryClient.ts
├── tests/
│   ├── setup.ts
│   └── unit/
└── tools/
    ├── scaffold.ts        # Project scaffolding
    └── schema-check.ts    # Schema validation CLI
```

## Documentation

- [Architecture](docs/architecture.md) - System design and patterns
- [DSL Reference](docs/dsl.md) - Complete schema documentation

## Technology Stack

- **Frontend**: React 18, TypeScript 5.6, Vite 5
- **UI Components**: Material-UI 6
- **Tables**: AG Grid Community 32
- **Forms**: react-hook-form 7, Zod 3
- **Charts**: vis-timeline 7
- **State**: React Query 5
- **Testing**: Vitest 2, Playwright 1.48
- **Mocking**: MSW 2
- **i18n**: i18next 23

## Pilot Limitations

This is a pilot implementation with:

- Emulated backend (MSW)
- Limited RBAC (basic role checking)
- No real persistence
- Basic error handling
- Simplified workflows

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run ci:all` locally
4. Create Pull Request
5. Ensure CI passes

## Testing

### Unit Tests

```bash
npm test
npm run test:coverage
```

Coverage targets:

- Lines: ≥70%
- Functions: ≥60%
- Branches: ≥60%
- Statements: ≥70%

### E2E Tests

```bash
# Install browsers (first time)
npx playwright install

# Run tests
npm run e2e

# Interactive mode
npm run e2e:ui
```

Test scenarios:

1. Sales Orders - table, filters, export
2. Form validation and logic
3. Gantt chart interaction
4. RBAC permissions
5. Theme switching
6. i18n language switching

## CI/CD

GitHub Actions workflow runs on every push:

1. Type checking
2. Linting
3. Format checking
4. Schema validation
5. Build
6. Unit tests
7. E2E tests
8. Artifact upload

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
