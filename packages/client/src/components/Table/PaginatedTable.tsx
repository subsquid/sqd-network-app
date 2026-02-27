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
  const [stablePageCount, setStablePageCount] = useState(pageCount > 1 ? pageCount : 0);
  const previousPageIndexRef = useRef(pageIndex);

  const isLoadingNewPage = isLoading && previousPageIndexRef.current !== pageIndex;
  const displayData = isLoadingNewPage ? previousData : data;

  // Once a real response arrives, snapshot pageCount and keep it stable during subsequent loads.
  useEffect(() => {
    if (!isLoading) {
      if (pageCount > 0) setStablePageCount(pageCount);
      if (data.length > 0) {
        setPreviousData(data);
        previousPageIndexRef.current = pageIndex;
      }
    }
  }, [isLoading, data, pageIndex, pageCount]);

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  const showEmptyState = !isLoading && table.getRowModel().rows.length === 0;

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
                  <TableRow key={row.id} sx={{ opacity: isLoading ? 0.5 : 1 }}>
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
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress color="secondary" size={40} thickness={4} />
            </Box>
          )}
        </Box>
      </Card>
      {stablePageCount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Pagination
            count={stablePageCount}
            page={pageIndex + 1}
            onChange={(_, page) => onPageChange(page - 1)}
          />
        </Box>
      )}
    </>
  );
}
