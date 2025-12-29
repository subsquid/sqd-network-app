import { dateFormat } from '@i18n';
import { percentFormatter } from '@lib/formatters/formatters';
import { ArrowBackIosNew, ArrowForwardIos, FilterList } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  Pagination,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import { SortDir, useMySources, useWorkers, WorkerSortBy } from '@api/subsquid-network-squid';
import { Search } from '@components/Search/Search';
import { SectionHeader } from '@components/SectionHeader';
import { DashboardTable, NoItems, SortableHeaderCell } from '@components/Table';
import {
  DelegationCapacity,
  WorkerDelegate,
  WorkerName,
  WorkerStatusChip,
  WorkerVersion,
} from '@components/Worker';
import { Location, useLocationState } from '@hooks/useLocationState';
import { WorkersFilters } from './WorkersFilters';
import { Card } from '@components/Card';

function TableNavigation({
  totalPages,
  setPage,
  page,
}: {
  setPage?: (page: number) => unknown;
  page: number;
  totalPages: number;
}) {
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return (
    <Box
      sx={{ textAlign: 'right' }}
      display="flex"
      alignItems="center"
      flex={1}
      justifyContent="flex-end"
    >
      <IconButton
        size="small"
        onClick={() => {
          setPage?.(page - 1);
        }}
        disabled={!hasPrevPage}
      >
        <ArrowBackIosNew />
      </IconButton>
      <Typography sx={{ fontVariant: 'tabular-nums' }}>
        {page} / {totalPages}
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
          setPage?.(page + 1);
        }}
        disabled={!hasNextPage}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}

const PER_PAGE = 15;

export function Workers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [query, setQuery] = useLocationState({
    page: new Location.Number(1),
    search: new Location.String(''),
    sortBy: new Location.Enum<WorkerSortBy>(WorkerSortBy.StakerAPR),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
    status: new Location.Array(new Location.String(), []),
    minUptime: new Location.String(''),
    minWorkerAPR: new Location.String(''),
    minDelegatorAPR: new Location.String(''),
    maxDelegationCapacity: new Location.String(''),
  });

  const { data: sources, isLoading: isSourcesLoading } = useMySources();

  // Helper to parse numeric filter values
  const parseFilterValue = (value: string): number | undefined => {
    if (!value || value.trim() === '') return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
  };

  const {
    workers,
    totalPages,
    page,
    isLoading: isWorkersLoading,
  } = useWorkers({
    search: query.search,
    page: query.page,
    perPage: PER_PAGE,
    sortBy: query.sortBy as WorkerSortBy,
    sortDir: query.sortDir as SortDir,
    statusFilter: query.status,
    minUptime: parseFilterValue(query.minUptime),
    minWorkerAPR: parseFilterValue(query.minWorkerAPR),
    minDelegatorAPR: parseFilterValue(query.minDelegatorAPR),
    maxDelegationCapacity: parseFilterValue(query.maxDelegationCapacity),
  });

  const isLoading = isSourcesLoading || isWorkersLoading;

  return (
    <>
      <Box>
        <SectionHeader
          title={
            <Search
              placeholder="Search"
              value={query.search}
              onChange={setQuery.search}
              fullWidth={isMobile}
            />
          }
          action={
            <IconButton
              size="small"
              onClick={() => setFiltersOpen(!filtersOpen)}
              sx={{
                backgroundColor: filtersOpen ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: filtersOpen ? 'action.selected' : 'action.hover',
                },
              }}
            >
              <FilterList />
            </IconButton>
          }
        />
        <Collapse in={filtersOpen}>
          <WorkersFilters
            sx={{ mt: 2 }}
            statusArray={query.status}
            onStatusChange={setQuery.status}
            minUptime={query.minUptime}
            onMinUptimeChange={setQuery.minUptime}
            minWorkerAPR={query.minWorkerAPR}
            onMinWorkerAPRChange={setQuery.minWorkerAPR}
            minDelegatorAPR={query.minDelegatorAPR}
            onMinDelegatorAPRChange={setQuery.minDelegatorAPR}
            maxDelegationCapacity={query.maxDelegationCapacity}
            onMaxDelegationCapacityChange={setQuery.maxDelegationCapacity}
          />
        </Collapse>
      </Box>
      <Card>
        <DashboardTable
          loading={isLoading}
          minHeight={PER_PAGE * 73}
          sx={{ m: -2, mt: -0.5 }}
        >
          <TableHead>
            <TableRow>
              <SortableHeaderCell sort={WorkerSortBy.Name} query={query} setQuery={setQuery}>
                Worker
              </SortableHeaderCell>
              <TableCell>Status</TableCell>
              <SortableHeaderCell sort={WorkerSortBy.Version} query={query} setQuery={setQuery}>
                Version
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.Uptime90d} query={query} setQuery={setQuery}>
                Uptime, 90d
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.WorkerAPR} query={query} setQuery={setQuery}>
                Worker APR
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.StakerAPR} query={query} setQuery={setQuery}>
                Delegator APR
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.DelegationCapacity}
                query={query}
                setQuery={setQuery}
                help={
                  <Box>
                    The Delegator APR decreases significantly once more than 20,000 SQD is delegated
                    to the worker.
                    <br />
                    To maximize delegation rewards, choose workers with high uptime and a low amount
                    of delegated SQD.
                  </Box>
                }
              >
                Delegation capacity
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.JoinedAt} query={query} setQuery={setQuery}>
                Created
              </SortableHeaderCell>
              <TableCell className="pinned"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.length ? (
              workers.map(worker => (
                <TableRow key={worker.peerId}>
                  <TableCell className="pinned">
                    <WorkerName worker={worker} />
                  </TableCell>
                  <TableCell>
                    <WorkerStatusChip worker={worker} />
                  </TableCell>
                  <TableCell>
                    <WorkerVersion worker={worker} />
                  </TableCell>
                  <TableCell>{percentFormatter(worker.uptime90Days)}</TableCell>
                  <TableCell>{worker.apr != null ? percentFormatter(worker.apr) : '-'}</TableCell>
                  <TableCell>
                    {worker.stakerApr != null ? percentFormatter(worker.stakerApr) : '-'}
                  </TableCell>
                  <TableCell>
                    <DelegationCapacity worker={worker} />
                  </TableCell>
                  <TableCell>{dateFormat(worker.createdAt)}</TableCell>
                  <TableCell className="pinned">
                    <Box display="flex" justifyContent="flex-end">
                      <WorkerDelegate worker={worker} sources={sources} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoItems />
            )}
          </TableBody>
        </DashboardTable>
        {!isWorkersLoading && totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setQuery.page(value)}
            />
          </Box>
        )}
      </Card>
    </>
  );
}
