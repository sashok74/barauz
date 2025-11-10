import { faker } from '@faker-js/faker';

faker.seed(42); // Deterministic seed for reproducible data

export interface SalesOrder {
  id: string;
  code: string;
  customer: string;
  customerId: string;
  status: 'Draft' | 'Approved' | 'Shipped' | 'Cancelled';
  amount: number;
  eta: string;
  lines: OrderLine[];
}

export interface OrderLine {
  id: string;
  sku: string;
  qty: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
}

export interface SKU {
  id: string;
  code: string;
  name: string;
}

export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  depends?: string[];
}

const statuses: Array<'Draft' | 'Approved' | 'Shipped' | 'Cancelled'> = [
  'Draft',
  'Approved',
  'Shipped',
  'Cancelled',
];

export const customers: Customer[] = Array.from({ length: 20 }, (_, i) => ({
  id: `cust-${i + 1}`,
  name: faker.company.name(),
}));

export const skus: SKU[] = Array.from({ length: 50 }, (_, i) => ({
  id: `sku-${i + 1}`,
  code: `SKU-${String(i + 1).padStart(4, '0')}`,
  name: faker.commerce.productName(),
}));

export const salesOrders: SalesOrder[] = Array.from({ length: 100 }, (_, i) => {
  const customer = customers[i % customers.length];
  if (!customer) throw new Error('Customer not found');

  const numLines = faker.number.int({ min: 1, max: 5 });
  const lines: OrderLine[] = Array.from({ length: numLines }, (__, j) => {
    const sku = skus[faker.number.int({ min: 0, max: skus.length - 1 })];
    if (!sku) throw new Error('SKU not found');

    const qty = faker.number.int({ min: 1, max: 100 });
    const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));

    return {
      id: `line-${i}-${j}`,
      sku: sku.code,
      qty,
      price,
    };
  });

  const amount = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

  return {
    id: `so-${i + 1}`,
    code: `SO-${String(i + 1).padStart(5, '0')}`,
    customer: customer.name,
    customerId: customer.id,
    status: statuses[i % statuses.length] as 'Draft' | 'Approved' | 'Shipped' | 'Cancelled',
    amount,
    eta: faker.date.future().toISOString().split('T')[0] as string,
    lines,
  };
});

export const ganttTasks: GanttTask[] = [
  {
    id: 'task-1',
    name: 'Procurement',
    start: '2024-01-01',
    end: '2024-01-10',
  },
  {
    id: 'task-2',
    name: 'Assembly',
    start: '2024-01-11',
    end: '2024-01-20',
    depends: ['task-1'],
  },
  {
    id: 'task-3',
    name: 'Testing',
    start: '2024-01-21',
    end: '2024-01-25',
    depends: ['task-2'],
  },
  {
    id: 'task-4',
    name: 'Packaging',
    start: '2024-01-26',
    end: '2024-01-30',
    depends: ['task-3'],
  },
  {
    id: 'task-5',
    name: 'Shipping',
    start: '2024-01-31',
    end: '2024-02-05',
    depends: ['task-4'],
  },
];
