# DSL Documentation

## Overview

The DSL (Domain Specific Language) is a JSON-based schema system for defining UI components. All schemas are validated using JSON Schema v2020-12.

## Schema Types

### Page Schema

Defines the overall page structure and layout.

```json
{
  "type": "Page",
  "id": "unique_page_id",
  "title": "Page Title",
  "layout": {
    "type": "split" | "tabs" | "single",
    "ratio": [60, 40]  // For split layout
  },
  "blocks": [
    // Array of Table, Form, or Gantt blocks
  ]
}
```

### Table Schema

Configures a data grid with columns, filters, and actions.

```json
{
  "type": "Table",
  "id": "table_id",
  "title": "Table Title",
  "dataSource": {
    "key": "unique_key",
    "method": "GET",
    "path": "/api/endpoint",
    "serverSide": true
  },
  "features": {
    "serverSide": true,
    "inlineEdit": true,
    "exportExcel": true,
    "columnChooser": true
  },
  "columns": [
    {
      "field": "field_name",
      "header": "Column Header",
      "width": 150,
      "type": "text" | "number" | "money" | "date" | "datetime" | "badge",
      "editable": true,
      "editor": "Text" | "Number" | "Date" | "Select" | "Autocomplete",
      "filter": "text" | "set" | "number" | "date",
      "agg": "sum" | "avg" | "min" | "max" | "count"
    }
  ],
  "rowActions": [
    {
      "label": "Action Label",
      "icon": "icon_name",
      "confirm": true,
      "action": "actionExpression()"
    }
  ],
  "bulkActions": [
    {
      "label": "Bulk Action",
      "action": "bulkActionExpression()"
    }
  ]
}
```

### Form Schema

Defines form fields, validation, and conditional logic.

```json
{
  "type": "Form",
  "id": "form_id",
  "title": "Form Title",
  "dataSource": {
    "key": "unique_key",
    "method": "GET",
    "path": "/api/endpoint/:id"
  },
  "submit": {
    "action": {
      "action": "submitExpression()"
    },
    "onSuccess": "refreshTable('table_id')"
  },
  "fields": [
    {
      "name": "field_name",
      "label": "Field Label",
      "component": "Text" | "Number" | "Select" | "Autocomplete" | "Checkbox" | "Date",
      "required": true,
      "options": ["Option1", "Option2"] | "lookup_key"
    }
  ],
  "logic": [
    {
      "when": "{\"==\":[{\"var\":\"form.status\"},\"value\"]}",
      "then": [
        {
          "disable": ["field1", "field2"]
        }
      ]
    }
  ]
}
```

### Gantt Schema

Configures a Gantt chart timeline.

```json
{
  "type": "Gantt",
  "id": "gantt_id",
  "title": "Gantt Title",
  "dataSource": {
    "key": "unique_key",
    "method": "GET",
    "path": "/api/gantt/endpoint"
  }
}
```

### RBAC Schema

Defines roles and permissions.

```json
{
  "roles": [
    {
      "name": "role_name",
      "permissions": ["resource:action", "sales_orders:read", "sales_orders:create"]
    }
  ]
}
```

## Data Source Configuration

```json
{
  "key": "unique_identifier",
  "method": "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  "path": "/api/endpoint",
  "params": {
    "param1": "value1"
  },
  "serverSide": true,
  "transform": "JSONLogic expression"
}
```

## Action Expressions

Actions use a simple expression language:

- `call('functionName', {param: value})` - Call API endpoint
- `openForm('formId', {id: value})` - Open form
- `refresh('tableId')` - Refresh table data
- `navigate('/path')` - Navigate to path

## JSONLogic Conditions

Form logic uses JSONLogic for conditional rules:

```json
{
  "when": "{\"==\":[{\"var\":\"form.fieldName\"},\"value\"]}",
  "then": [
    {
      "disable": ["field1", "field2"],
      "hide": ["field3"]
    }
  ]
}
```

Common operators:

- `==`, `!=`: Equality
- `>`, `<`, `>=`, `<=`: Comparison
- `and`, `or`: Logical operators
- `var`: Variable access

## Column Types

- **text**: Plain text
- **number**: Numeric values
- **money**: Currency formatting
- **date**: Date display (YYYY-MM-DD)
- **datetime**: Date and time
- **badge**: Status badge with colors

## Editor Types

- **Text**: Text input
- **Number**: Number input
- **Date**: Date picker
- **Select**: Dropdown select
- **Autocomplete**: Searchable dropdown
- **Checkbox**: Boolean checkbox

## Filter Types

- **text**: Text search filter
- **set**: Multi-select filter
- **number**: Numeric range filter
- **date**: Date range filter

## Best Practices

1. Use consistent naming conventions for IDs
2. Keep action expressions simple
3. Validate schemas before deployment
4. Use server-side operations for large datasets
5. Leverage JSONLogic for complex conditions
6. Document custom lookup keys
7. Test schemas with validation tool

## Validation

All schemas must validate against their respective JSON Schema definitions in `/packages/schemas/`.

Use the validation tool:

```bash
npm run schema:validate
```

## Examples

See `/schemas/` directory for complete working examples:

- `sales_orders.page.json` - Complex table with form
- `mfg_gantt.page.json` - Gantt chart example
- `rbac.json` - RBAC configuration
