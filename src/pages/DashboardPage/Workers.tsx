import { dateFormat } from '@i18n';
import { percentFormatter } from '@lib/formatters/formatters';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import {
  IconButton,
  styled,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';

import { SortDir, useMySources, useWorkers, WorkerSortBy } from '@api/subsquid-network-squid';
import { Search } from '@components/Search/Search';
import { DashboardTable, SortableHeaderCell, NoItems } from '@components/Table';
import { Location, useLocationState } from '@hooks/useLocationState';
import { DelegationCapacity } from '@pages/WorkersPage/DelegationCapacity';
import { WorkerDelegate } from '@pages/WorkersPage/WorkerDelegate';
import { WorkerName } from '@pages/WorkersPage/WorkerName';
import { WorkerStatusChip } from '@pages/WorkersPage/WorkerStatus';
import { WorkerVersion } from '@pages/WorkersPage/WorkerVersion';
import { Card } from '@components/Card';
import { SquaredChip } from '@components/Chip/SquaredChip';

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
      sx={{ textAlign: 'right', mt: 1 }}
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

export const SummaryLabel = styled(Box, {
  name: 'SummaryLabel',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
}));
export const SummaryValue = styled(Box, {
  name: 'SummaryValue',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  flex: 1,
}));

export function Workers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [query, setQuery] = useLocationState({
    page: new Location.Number(1),
    search: new Location.String(''),
    sortBy: new Location.Enum<WorkerSortBy>(WorkerSortBy.StakerAPR),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
  });

  const { data: sources, isLoading: isSourcesLoading } = useMySources();

  const {
    workers,
    totalPages,
    page,
    isLoading: isWorkersLoading,
  } = useWorkers({
    search: query.search,
    page: query.page,
    perPage: 15,
    sortBy: query.sortBy as WorkerSortBy,
    sortDir: query.sortDir as SortDir,
  });

  const isLoading = isSourcesLoading || isWorkersLoading;

  return (
    <Card
      title={<SquaredChip label="Workers" color="primary" />}
      action={
        <Search
          placeholder="Search"
          value={query.search}
          onChange={setQuery.search}
          fullWidth={isMobile}
        />
      }
    >
      <DashboardTable loading={isLoading} sx={{ mb: 2 }}>
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
      {!isWorkersLoading && (
        <TableNavigation page={page} totalPages={totalPages} setPage={setQuery.page} />
      )}
    </Card>
  );
}
