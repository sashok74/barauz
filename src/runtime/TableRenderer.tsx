import { useRef, useMemo, useCallback, useState } from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import type { TableBlock } from '../dsl/types';
import { StatusBadge } from './widgets/StatusBadge';
import { apiRequest } from '../data/queryClient';

interface TableRendererProps {
  schema: TableBlock;
}

export function TableRenderer({ schema }: TableRendererProps) {
  const gridRef = useRef<AgGridReact>(null);
  const [selectedRows, setSelectedRows] = useState<unknown[]>([]);

  const columnDefs = useMemo<ColDef[]>(() => {
    return schema.columns.map((col) => {
      const colDef: ColDef = {
        field: col.field,
        headerName: col.header,
        width: col.width,
        pinned: col.pinned,
        editable: col.editable && schema.features?.inlineEdit,
        filter:
          col.filter === 'text'
            ? 'agTextColumnFilter'
            : col.filter === 'number'
              ? 'agNumberColumnFilter'
              : col.filter === 'date'
                ? 'agDateColumnFilter'
                : col.filter === 'set'
                  ? 'agSetColumnFilter'
                  : false,
      };

      if (col.type === 'badge') {
        colDef.cellRenderer = (params: { value: string }) => {
          if (!params.value) return null;
          return <StatusBadge status={params.value} />;
        };
      }

      if (col.type === 'money') {
        colDef.valueFormatter = (params) => {
          if (params.value == null) return '';
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(Number(params.value));
        };
      }

      if (col.type === 'date') {
        colDef.valueFormatter = (params) => {
          if (!params.value) return '';
          return new Date(String(params.value)).toLocaleDateString();
        };
      }

      return colDef;
    });
  }, [schema.columns, schema.features?.inlineEdit]);

  const datasource = useMemo<IServerSideDatasource>(() => {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;
        const pageSize = endRow! - startRow!;
        const page = Math.floor(startRow! / pageSize);

        const queryParams: Record<string, unknown> = {
          page,
          pageSize,
        };

        if (sortModel && sortModel.length > 0) {
          queryParams.sort = sortModel[0]?.colId;
          queryParams.order = sortModel[0]?.sort;
        }

        if (filterModel) {
          queryParams.filter = JSON.stringify(filterModel);
        }

        apiRequest<{ data: unknown[]; total: number }>({
          method: schema.dataSource.method,
          path: schema.dataSource.path,
          params: queryParams,
        })
          .then((result) => {
            params.success({
              rowData: result.data,
              rowCount: result.total,
            });
          })
          .catch(() => {
            params.fail();
          });
      },
    };
  }, [schema.dataSource]);

  const onGridReady = useCallback(
    (params: { api: GridApi }) => {
      if (schema.features?.serverSide) {
        params.api.setGridOption('serverSideDatasource', datasource);
      }
    },
    [datasource, schema.features?.serverSide]
  );

  const handleExport = useCallback(() => {
    gridRef.current?.api.exportDataAsExcel({
      fileName: `${schema.id}.xlsx`,
    });
  }, [schema.id]);

  const onSelectionChanged = useCallback(() => {
    const selected = gridRef.current?.api.getSelectedRows() || [];
    setSelectedRows(selected);
  }, []);

  return (
    <Box data-testid={schema.id}>
      {schema.title && (
        <Typography variant="h6" gutterBottom>
          {schema.title}
        </Typography>
      )}
      {(schema.features?.exportExcel || schema.bulkActions) && (
        <Box mb={2}>
          <ButtonGroup variant="outlined" size="small">
            {schema.features?.exportExcel && (
              <Button onClick={handleExport} data-testid={`${schema.id}-export`}>
                Export
              </Button>
            )}
            {schema.bulkActions?.map((action) => (
              <Button
                key={action.label}
                disabled={selectedRows.length === 0}
                data-testid={`${schema.id}-bulk-${action.label.toLowerCase()}`}
              >
                {action.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      )}
      <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowModelType={schema.features?.serverSide ? 'serverSide' : 'clientSide'}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={20}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
        />
      </div>
    </Box>
  );
}
