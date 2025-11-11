import Chip from '@mui/material/Chip';

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<
  string,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  Draft: 'default',
  Approved: 'primary',
  Shipped: 'success',
  Cancelled: 'error',
  Pending: 'warning',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || 'default';
  return <Chip label={status} color={color} size="small" />;
}
