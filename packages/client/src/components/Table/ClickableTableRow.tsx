import type { ReactNode } from 'react';

import { TableCell, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const clickableRowSx = {
  cursor: 'pointer',
  '&:has(.cell-interactive:hover)': {
    cursor: 'default',
    backgroundColor: 'transparent !important',
  },
} as const;

export function ClickableTableRow({ to, children }: { to: string; children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <TableRow hover sx={clickableRowSx} onClick={() => navigate(to)}>
      {children}
    </TableRow>
  );
}

export function InteractiveCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <TableCell
      className={`cell-interactive${className ? ` ${className}` : ''}`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </TableCell>
  );
}
