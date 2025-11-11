import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TableRenderer } from '../../src/runtime/TableRenderer';
import type { TableBlock } from '../../src/dsl/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockTableSchema: TableBlock = {
  type: 'Table',
  id: 'testTable',
  title: 'Test Table',
  dataSource: {
    key: 'testData',
    method: 'GET',
    path: '/api/test',
    serverSide: true,
  },
  features: {
    serverSide: true,
    inlineEdit: false,
    exportExcel: true,
    columnChooser: false,
  },
  columns: [
    {
      field: 'id',
      header: 'ID',
      width: 100,
    },
    {
      field: 'name',
      header: 'Name',
    },
    {
      field: 'status',
      header: 'Status',
      type: 'badge',
    },
  ],
};

describe('TableRenderer', () => {
  it('should render table with title', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TableRenderer schema={mockTableSchema} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('should render table with correct test id', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TableRenderer schema={mockTableSchema} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('testTable')).toBeInTheDocument();
  });

  it('should render export button when exportExcel is enabled', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TableRenderer schema={mockTableSchema} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('testTable-export')).toBeInTheDocument();
  });
});
