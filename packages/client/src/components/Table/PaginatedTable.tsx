import { ReactNode, useEffect, useRef, useState } from 'react';

import {
  Box,
  CircularProgress,
  Pagination,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Card } from '@components/Card';
import { DashboardTable, NoItems } from '@components/Table';

interface PaginatedTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: ReactNode;
}

const getAlignment = (columnId: string) => (columnId === 'actions' ? 'center' : 'left');

export function PaginatedTable<TData>({
  data,
  columns,
  pageIndex,
  pageCount,
  onPageChange,
  isLoading = false,
  emptyMessage = 'No items to display',
}: PaginatedTableProps<TData>) {
  const [previousData, setPreviousData] = useState<TData[]>(data);
  const previousPageIndexRef = useRef(pageIndex);

  const isLoadingNewPage = isLoading && previousPageIndexRef.current !== pageIndex;
  const displayData = isLoadingNewPage ? previousData : data;

  // Update previous data when new data arrives
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      setPreviousData(data);
      previousPageIndexRef.current = pageIndex;
    }
  }, [isLoading, data, pageIndex]);

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  const showEmptyState = table.getRowModel().rows.length === 0 && !isLoading;
  const rowOpacity = isLoadingNewPage ? 0.5 : 1;

  return (
    <>
      <Card>
        <Box sx={{ position: 'relative' }}>
          <DashboardTable>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell key={header.id} align={getAlignment(header.id)}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {showEmptyState ? (
                <NoItems>
                  <Typography>{emptyMessage}</Typography>
                </NoItems>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} sx={{ opacity: rowOpacity }}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} align={getAlignment(cell.column.id)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </DashboardTable>
          {isLoadingNewPage && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          count={pageCount}
          page={pageIndex + 1}
          onChange={(_, page) => onPageChange(page - 1)}
        />
      </Box>
    </>
  );
}
