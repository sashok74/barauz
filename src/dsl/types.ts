// Type definitions for DSL schemas

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
