import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

interface FileToCreate {
  path: string;
  content: string;
}

const filesToCreate: FileToCreate[] = [
  {
    path: 'src/app/main.tsx',
    content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
  },
  {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ERP UI Renderer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/main.tsx"></script>
  </body>
</html>
`,
  },
  {
    path: 'tests/setup.ts',
    content: `import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
`,
  },
  {
    path: 'src/dsl/types.ts',
    content: `// Type definitions for DSL schemas

export interface DataSource {
  key: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  params?: Record<string, unknown>;
  serverSide?: boolean;
  transform?: string;
}

export interface Action {
  icon?: string;
  label: string;
  confirm?: boolean;
  action: string;
}

export interface TableColumn {
  field: string;
  header: string;
  width?: number;
  type?: 'text' | 'number' | 'money' | 'date' | 'datetime' | 'badge';
  pinned?: 'left' | 'right';
  editable?: boolean;
  editor?: 'Text' | 'Number' | 'Date' | 'Select' | 'Autocomplete' | 'Checkbox';
  lookup?: string;
  filter?: 'text' | 'set' | 'number' | 'date';
  agg?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export interface TableBlock {
  type: 'Table';
  id: string;
  title?: string;
  dataSource: DataSource;
  features?: {
    serverSide?: boolean;
    inlineEdit?: boolean;
    exportExcel?: boolean;
    columnChooser?: boolean;
  };
  columns: TableColumn[];
  rowActions?: Action[];
  bulkActions?: Action[];
}

export interface FormField {
  name: string;
  label: string;
  component: 'Text' | 'Number' | 'Select' | 'Autocomplete' | 'Checkbox' | 'Date' | 'TableField';
  required?: boolean;
  options?: unknown[] | string;
  columns?: unknown[];
}

export interface FormLogic {
  when: string;
  then: Array<{ disable?: string[] }>;
}

export interface FormBlock {
  type: 'Form';
  id: string;
  title?: string;
  dataSource: DataSource;
  submit: {
    action: { action: string };
    onSuccess?: string;
  };
  fields: FormField[];
  logic?: FormLogic[];
}

export interface GanttBlock {
  type: 'Gantt';
  id: string;
  title?: string;
  dataSource: DataSource;
}

export type Block = TableBlock | FormBlock | GanttBlock;

export interface PageSchema {
  type: 'Page';
  id: string;
  title: string;
  layout: {
    type: 'split' | 'tabs' | 'single';
    ratio?: number[];
  };
  blocks: Block[];
}

export interface RBACRole {
  name: string;
  permissions: string[];
}

export interface RBACSchema {
  roles: RBACRole[];
}
`,
  },
  {
    path: '.github/pull_request_template.md',
    content: `## Description

<!-- Describe your changes -->

## Checklist

- [ ] Code passes \`npm run typecheck\`
- [ ] Code passes \`npm run lint\`
- [ ] Code passes \`npm run format\`
- [ ] All tests pass (\`npm test\`)
- [ ] E2E tests pass (\`npm run e2e\`)
- [ ] Schema validation passes (\`npm run schema:validate\`)
- [ ] Build succeeds (\`npm run build\`)
- [ ] Documentation updated if needed
- [ ] Screenshots/videos attached for UI changes
`,
  },
];

function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

function createFileIfNotExists(relativePath: string, content: string): void {
  const fullPath = path.join(ROOT_DIR, relativePath);

  if (fs.existsSync(fullPath)) {
    console.log(`⊘ Skipped (exists): ${relativePath}`);
    return;
  }

  ensureDirectoryExists(fullPath);
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✓ Created: ${relativePath}`);
}

function main(): void {
  console.log('🚀 Scaffolding project structure...\n');

  for (const file of filesToCreate) {
    createFileIfNotExists(file.path, file.content);
  }

  console.log('\n✅ Scaffolding complete!');
}

main();
