import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageRenderer } from '../runtime/PageRenderer';
import salesOrdersPage from '../../schemas/sales_orders.page.json';
import mfgGanttPage from '../../schemas/mfg_gantt.page.json';
import type { PageSchema } from '../dsl/types';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/sales-orders" replace />,
  },
  {
    path: '/sales-orders',
    element: <PageRenderer schema={salesOrdersPage as PageSchema} />,
  },
  {
    path: '/production',
    element: <PageRenderer schema={mfgGanttPage as PageSchema} />,
  },
]);
