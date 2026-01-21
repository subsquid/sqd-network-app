import React, { PropsWithChildren, SyntheticEvent } from 'react';

import { Stack, SxProps, Table, TableCell, TableProps, Tooltip, styled } from '@mui/material';
import { Box } from '@mui/system';

import { SortDir } from '@api/subsquid-network-squid';
import { SortIcon } from '@components/SortIcon';

interface BorderedTableProps extends TableProps {
  className?: string;
  borderColor?: string;
  hoverColor?: string;
  cellPadding?: number | string;
  borderRadius?: number;
}

export const BorderedTable = styled(Table, {
  shouldForwardProp: prop =>
    !['borderColor', 'hoverColor', 'cellPadding', 'borderRadius'].includes(prop as string),
})<BorderedTableProps>(
  ({
    theme,
    borderColor,
    hoverColor,
    cellPadding = 2.5,
    borderRadius: customBorderRadius = theme.shape.borderRadius,
  }) => ({
    borderRadius: customBorderRadius,
    borderSpacing: 0,
    borderCollapse: 'separate',

    '& td, & th': {
      background: theme.palette.background.paper,
      borderBottom: `1px solid ${borderColor || theme.palette.background.default}`,
      padding: theme.spacing(cellPadding, 1.5),
      fontVariantNumeric: 'tabular-nums',
    },

    '& td:first-of-type, & th:first-of-type': {
      paddingLeft: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(2.5),
      },
    },

    '& td:last-of-type, & th:last-of-type': {
      paddingRight: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        paddingRight: theme.spacing(2.5),
      },
    },

    '& td:last-of-type.pinned, & th:last-of-type.pinned': {
      boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      right: 0,
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
      },
    },

    '& td:first-of-type.pinned, & th:first-of-type.pinned': {
      position: 'sticky',
      left: 0,
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
      },
    },

    '& th': {
      color: theme.palette.text.secondary,
      fontWeight: 'normal',
      lineHeight: 1,
      fontSize: '0.875rem',
    },

    '& tr.hoverable:hover td, & tr.hovered td': {
      background: hoverColor || theme.palette.action.hover,
    },

    '& thead th:first-of-type': { borderTopLeftRadius: customBorderRadius },
    '& thead th:last-of-type': { borderTopRightRadius: customBorderRadius },

    '& tbody tr:last-of-type td': {
      borderBottom: 'none',
    },
    '& tbody tr:last-of-type td:first-of-type': {
      borderBottomLeftRadius: customBorderRadius,
    },
    '& tbody tr:last-of-type td:last-of-type': {
      borderBottomRightRadius: customBorderRadius,
    },
  }),
);

const ClickableStack = styled(Stack)(({}) => ({
  cursor: 'pointer',
  width: 'auto',
  userSelect: 'none',
  alignItems: 'center',
}));

interface HeaderCellProps extends PropsWithChildren {
  width?: string | number;
  help?: React.ReactNode;
  sx?: SxProps;
  align?: 'left' | 'center' | 'right';
}

export const HeaderCell = ({ help, children, sx, align = 'left' }: HeaderCellProps) => (
  <Tooltip title={help} arrow placement="top">
    <TableCell sx={{ textAlign: align, ...sx }}>{children}</TableCell>
  </Tooltip>
);

interface SortableHeaderCellProps<S extends string> extends PropsWithChildren {
  sort: S;
  query: { sortBy: string; sortDir: string };
  setQuery: { sortBy: (v: string) => void; sortDir: (v: string) => void };
  help?: React.ReactNode;
  sx?: SxProps;
  align?: 'left' | 'center' | 'right';
}

export const SortableHeaderCell = <S extends string>({
  sort,
  children,
  query,
  setQuery,
  help,
  sx,
  align = 'left',
}: SortableHeaderCellProps<S>) => {
  const handleSortChange = (sortBy: S) => (e: SyntheticEvent) => {
    e.preventDefault();

    if (query.sortBy === sortBy) {
      setQuery.sortDir(query.sortDir === SortDir.Asc ? SortDir.Desc : SortDir.Asc);
    } else {
      setQuery.sortBy(sortBy);
      setQuery.sortDir(SortDir.Asc);
    }
  };

  return (
    <HeaderCell help={help} sx={sx} align={align}>
      <ClickableStack onClick={handleSortChange(sort)} direction="row" spacing={1}>
        <Box>{children}</Box>
        <Box display="flex">
          <SortIcon query={query} value={sort} />
        </Box>
      </ClickableStack>
    </HeaderCell>
  );
};
