import { http, HttpResponse } from 'msw';
import { salesOrders, customers, skus, ganttTasks, SalesOrder } from './seeds';

export const handlers = [
  // Get sales orders with pagination, sorting, and filtering
  http.get('/api/sales-orders', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const sort = url.searchParams.get('sort');
    const order = url.searchParams.get('order') as 'asc' | 'desc' | null;
    const filterParam = url.searchParams.get('filter');

    let filtered = [...salesOrders];

    // Apply filters
    if (filterParam) {
      try {
        const filters = JSON.parse(filterParam) as Record<string, { values?: string[] }>;
        Object.entries(filters).forEach(([field, filterConfig]) => {
          if (filterConfig.values && filterConfig.values.length > 0) {
            filtered = filtered.filter((order) => {
              const fieldValue = order[field as keyof SalesOrder];
              if (fieldValue === undefined || fieldValue === null) {
                return filterConfig.values?.includes('');
              }
              if (
                typeof fieldValue === 'string' ||
                typeof fieldValue === 'number' ||
                typeof fieldValue === 'boolean'
              ) {
                return filterConfig.values?.includes(String(fieldValue));
              }
              return false;
            });
          }
        });
      } catch (e) {
        console.error('Filter parse error:', e);
      }
    }

    // Apply sorting
    if (sort) {
      filtered.sort((a, b) => {
        const aVal = a[sort as keyof SalesOrder];
        const bVal = b[sort as keyof SalesOrder];

        if (aVal === undefined || bVal === undefined) return 0;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (
          (typeof aVal === 'string' || typeof aVal === 'number' || typeof aVal === 'boolean') &&
          (typeof bVal === 'string' || typeof bVal === 'number' || typeof bVal === 'boolean')
        ) {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return order === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);

    return HttpResponse.json({
      data: paginatedData,
      total: filtered.length,
    });
  }),

  // Get single sales order
  http.get('/api/sales-orders/:id', ({ params }) => {
    const order = salesOrders.find((o) => o.id === params.id);
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  // Create sales order
  http.post('/api/sales-orders', async ({ request }) => {
    const body = (await request.json()) as Partial<SalesOrder>;
    const newOrder: SalesOrder = {
      id: `so-${salesOrders.length + 1}`,
      code: `SO-${String(salesOrders.length + 1).padStart(5, '0')}`,
      customer: body.customer || '',
      customerId: body.customerId || '',
      status: body.status || 'Draft',
      amount: body.amount || 0,
      eta: body.eta || (new Date().toISOString().split('T')[0] as string),
      lines: body.lines || [],
    };
    salesOrders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // Update sales order
  http.put('/api/sales-orders/:id', async ({ params, request }) => {
    const index = salesOrders.findIndex((o) => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Partial<SalesOrder>;
    salesOrders[index] = { ...salesOrders[index]!, ...body };
    return HttpResponse.json(salesOrders[index]);
  }),

  // Delete sales order
  http.delete('/api/sales-orders/:id', ({ params }) => {
    const index = salesOrders.findIndex((o) => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    salesOrders.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Bulk set status
  http.post('/api/sales-orders/bulkSetStatus', async ({ request }) => {
    const body = (await request.json()) as { ids: string[]; status: string };
    body.ids.forEach((id) => {
      const order = salesOrders.find((o) => o.id === id);
      if (order) {
        order.status = body.status as SalesOrder['status'];
      }
    });
    return HttpResponse.json({ success: true });
  }),

  // Get lookups - customers
  http.get('/api/lookups/customers', () => {
    return HttpResponse.json(customers);
  }),

  // Get lookups - SKUs
  http.get('/api/lookups/skus', () => {
    return HttpResponse.json(skus);
  }),

  // Get Gantt tasks
  http.get('/api/mfg-orders/:id/gantt', () => {
    return HttpResponse.json({ tasks: ganttTasks });
  }),

  // Update Gantt task
  http.patch('/api/mfg-orders/:orderId/gantt/:taskId', async ({ params, request }) => {
    const body = (await request.json()) as { start: string; end: string };
    const task = ganttTasks.find((t) => t.id === params.taskId);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    task.start = body.start;
    task.end = body.end;
    return HttpResponse.json(task);
  }),
];
