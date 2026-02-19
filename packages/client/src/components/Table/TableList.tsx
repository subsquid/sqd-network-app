import { Table, TableProps, styled } from '@mui/material';

interface TableListProps extends TableProps {
  className?: string;
  noBorder?: boolean;
  noPadding?: boolean;
}

export const TableList = styled(Table, {
  name: 'TableList',
})<TableListProps>(({ theme, noBorder, noPadding }) => ({
  '& td, & th': {
    borderBottomColor: noBorder ? 'transparent' : theme.palette.divider,
  },
  '& tr td:first-child, & tr th:first-child': {
    paddingLeft: noPadding ? 0 : theme.spacing(2),
  },
  '& tr td:last-child, & tr th:last-child': {
    paddingRight: noPadding ? 0 : theme.spacing(2),
  },
  '& tr td, & tr th': {
    padding: noPadding ? 0 : theme.spacing(1),
  },
}));
