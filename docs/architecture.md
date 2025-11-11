# Architecture

## Overview

The ERP UI Renderer is a schema-driven UI framework that dynamically generates user interfaces based on JSON schema definitions. This approach allows for rapid development and consistent UI patterns across the application.

## Key Components

### 1. DSL (Domain Specific Language)

The DSL defines the structure and behavior of UI components through JSON schemas:

- **Page Schema**: Defines overall page layout and contains blocks
- **Table Schema**: Configures data grids with columns, filters, actions
- **Form Schema**: Defines form fields, validation, and logic
- **Gantt Schema**: Configures Gantt chart visualization
- **RBAC Schema**: Defines roles and permissions

### 2. Runtime Renderers

Renderers interpret schemas and generate React components:

- **PageRenderer**: Handles page layout (split, tabs, single)
- **TableRenderer**: Renders AG Grid tables with server-side operations
- **FormRenderer**: Creates forms using react-hook-form and Zod validation
- **GanttRenderer**: Displays timelines using vis-timeline

### 3. Data Layer

- **MSW (Mock Service Worker)**: Provides API mocking for development and testing
- **React Query**: Manages server state and caching
- **Seed Data**: Deterministic fake data generated with Faker.js

### 4. Validation

- **AJV**: JSON Schema validation for DSL schemas
- **Zod**: Runtime validation for form data
- **JSONLogic**: Conditional logic evaluation in forms

## Data Flow

```
Schema (JSON) → Validation (AJV) → Renderer (React) → UI Components
                                                    ↓
                                            User Interaction
                                                    ↓
                                            API Request (MSW)
                                                    ↓
                                            State Update (React Query)
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: React Query for server state
- **Forms**: react-hook-form + Zod
- **Tables**: AG Grid Community
- **Charts**: vis-timeline
- **Testing**: Vitest (unit), Playwright (e2e)
- **Build**: Vite
- **Mocking**: MSW

## Design Patterns

### Schema-Driven Architecture

All UI components are generated from JSON schemas, enabling:

- Consistent UI patterns
- Easy customization without code changes
- Version control of UI definitions
- Dynamic UI generation

### Server-Side Operations

Tables support server-side pagination, sorting, and filtering:

- Reduces client-side memory usage
- Handles large datasets efficiently
- Consistent with real-world API patterns

### Conditional Logic

Forms use JSONLogic for dynamic behavior:

- Field visibility control
- Validation rules
- Field disable/enable based on state

## Testing Strategy

### Unit Tests

- Schema validation
- Renderer logic
- Form logic evaluation

### E2E Tests

- User workflows
- Navigation
- Theme and i18n
- Data interactions

## Future Enhancements

1. Real backend integration
2. Desktop wrapper (Electron/Tauri)
3. Advanced widgets (charts, maps)
4. Workflow engine
5. Multi-tenant support
6. Audit logging
