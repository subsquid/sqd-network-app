import React from 'react';

import { Box, styled, SxProps, Table, TableBody, TableProps } from '@mui/material';

import { Loader } from '@components/Loader';

interface DashboardTableProps {
  /** Optional custom styles */
  sx?: SxProps;
  /** Loading state of the table */
  loading?: boolean;
  /** Table content including TableHead and TableBody */
  children: React.ReactNode;
  /** Optional class name for the root element */
  className?: string;
  /** Optional minimum height for the table body */
  minHeight?: number;
  /** Optional scrollbar styles */
  scrollbarStyles?: {
    height?: string;
    trackColor?: string;
    thumbColor?: string;
    thumbHoverColor?: string;
    borderRadius?: string;
  };
  /** Additional table props */
  tableProps?: Omit<TableProps, 'children'>;
}

export const DashboardTableBase = styled(Table)(({ theme }) => ({
  '& td, & th': {
    ...theme.typography.body1,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2, 1, 0),
    minHeight: theme.spacing(8),
  },

  '& td:last-child, & th:last-child': {
    paddingRight: theme.spacing(0),
  },

  '& th': {
    ...theme.typography.body2,
    minHeight: theme.spacing(4),
    textAlign: 'start',
    paddingTop: 0,
  },

  '& tbody': {
    position: 'relative',
    minHeight: 150,
  },

  '& tbody:not(:has(td))': {
    height: 200,
  },

  '& tbody .no-items': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  '& tbody:after': {
    position: 'sticky',
  },

  width: '100%',
  minWidth: 'max-content',
}));

const LoadingTableBody = ({ minHeight = 200 }: { minHeight?: number }) => (
  <TableBody>
    <tr>
      <td colSpan={100} style={{ borderBottom: 'none' }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={minHeight}>
          <Loader loading />
        </Box>
      </td>
    </tr>
  </TableBody>
);

interface TitleSectionProps {
  title: React.ReactNode;
}

const TitleSection = ({ title }: TitleSectionProps) =>
  title ? (
    <Box display="flex" justifyContent="space-between" marginBottom={1} minHeight={36}>
      {title}
    </Box>
  ) : null;

export const DashboardTable = ({
  children,
  sx,
  loading,
  className,
  minHeight = 200,
  scrollbarStyles = {
    height: '4px',
    trackColor: 'transparent',
    thumbColor: '#888',
    thumbHoverColor: '#555',
    borderRadius: '2px',
  },
  tableProps,
}: DashboardTableProps) => {
  const tableContent = loading ? <LoadingTableBody minHeight={minHeight} /> : children;

  return (
    <Box sx={sx} className={className}>
      <Box
        position="relative"
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          maxHeight: '100%',
        }}
      >
        <DashboardTableBase {...tableProps}>{tableContent}</DashboardTableBase>
      </Box>
    </Box>
  );
};
