import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters.ts';
import { fromSqd } from '@lib/network';
import { Box, Button, Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

import {
  SortDir,
  useMySources,
  useMyWorkers,
  WorkerSortBy,
  WorkerStatus,
} from '@api/subsquid-network-squid';
import { SquaredChip } from '@components/Chip';
import { DashboardTable, SortableHeaderCell, NoItems } from '@components/Table';
import { Location, useLocationState } from '@hooks/useLocationState';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ConnectedWalletRequired } from '@network/ConnectedWalletRequired';
import { useContracts } from '@network/useContracts';
import { WorkerName } from '@pages/WorkersPage/WorkerName';
import { WorkerStatusChip } from '@pages/WorkersPage/WorkerStatus';

import { AddWorkerButton } from './AddNewWorker';
import { WorkerUnregisterButton } from './WorkerUnregister';
import { WorkerVersion } from './WorkerVersion';
import { WorkerWithdrawButton } from './WorkerWithdraw';

export function MyWorkers() {
  const [query, setQuery] = useLocationState({
    sortBy: new Location.Enum<WorkerSortBy>(WorkerSortBy.WorkerReward),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
  });

  const { SQD_TOKEN } = useContracts();

  const { data: sources, isLoading: isSourcesLoading } = useMySources();

  const { data: workers, isLoading: isWorkersLoading } = useMyWorkers({
    sortBy: query.sortBy as WorkerSortBy,
    sortDir: query.sortDir as SortDir,
  });

  const isLoading = isSourcesLoading || isWorkersLoading;

  return (
    <Box>
      <DashboardTable
        loading={isLoading}
        title={
          <>
            <SquaredChip label="My Workers" color="primary" />
            <Stack direction="row" spacing={1}>
              <Button
                color="secondary"
                variant="outlined"
                component={Link}
                target="_blank"
                to="https://docs.sqd.dev/subsquid-network/participate/worker/"
              >
                LEARN MORE
              </Button>
              <AddWorkerButton sources={sources} disabled={isLoading} />
            </Stack>
          </>
        }
      >
        <>
          <TableHead>
            <TableRow>
              <SortableHeaderCell sort={WorkerSortBy.Name} query={query} setQuery={setQuery}>
                Worker
              </SortableHeaderCell>
              <TableCell>Status</TableCell>
              <SortableHeaderCell sort={WorkerSortBy.Version} query={query} setQuery={setQuery}>
                Version
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.Uptime24h} query={query} setQuery={setQuery}>
                Uptime, 24h
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.Uptime90d} query={query} setQuery={setQuery}>
                Uptime, 90d
              </SortableHeaderCell>
              <SortableHeaderCell sort={WorkerSortBy.WorkerAPR} query={query} setQuery={setQuery}>
                Worker APR
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.WorkerReward}
                query={query}
                setQuery={setQuery}
              >
                Total reward
              </SortableHeaderCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers?.length ? (
              workers.map(worker => {
                return (
                  <TableRow key={worker.peerId}>
                    <TableCell>
                      <WorkerName worker={worker} />
                    </TableCell>
                    <TableCell>
                      <WorkerStatusChip worker={worker} />
                    </TableCell>
                    <TableCell>
                      <WorkerVersion worker={worker} />
                    </TableCell>
                    <TableCell>{percentFormatter(worker.uptime24Hours)}</TableCell>
                    <TableCell>{percentFormatter(worker.uptime90Days)}</TableCell>
                    <TableCell>{worker.apr != null ? percentFormatter(worker.apr) : '-'}</TableCell>
                    <TableCell>
                      {tokenFormatter(
                        fromSqd(worker.claimableReward).plus(fromSqd(worker.claimedReward)),
                        SQD_TOKEN,
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="flex-end">
                        {worker.status === WorkerStatus.Deregistered ||
                        worker.status === WorkerStatus.Deregistering ? (
                          <WorkerWithdrawButton
                            worker={worker}
                            source={{
                              ...worker.owner,
                              locked: !!worker.locked,
                              lockEnd: worker.lockEnd,
                            }}
                          />
                        ) : (
                          <WorkerUnregisterButton
                            worker={worker}
                            source={worker.owner}
                            disabled={worker.status !== WorkerStatus.Active}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : isLoading ? null : (
              <NoItems>
                <span>No worker registered yet</span>
              </NoItems>
            )}
          </TableBody>
        </>
      </DashboardTable>
    </Box>
  );
}

export function WorkersPage() {
  return (
    <CenteredPageWrapper className="wide">
      <ConnectedWalletRequired>
        <MyWorkers />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
