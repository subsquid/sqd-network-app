import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Box, Button, Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';

import {
  SortDir,
  WorkerSortBy,
  WorkerStatus,
  useMySources,
  useMyWorkers,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { SquaredChip } from '@components/Chip';
import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';
import { SectionHeader } from '@components/SectionHeader';
import { ClickableTableRow, DashboardTable, InteractiveCell, NoItems, SortableHeaderCell } from '@components/Table';
import {
  WorkerName,
  WorkerStatusChip,
  WorkerUnregisterButton,
  WorkerVersion,
  WorkerWithdrawButton,
} from '@components/Worker';
import { useContracts } from '@hooks/network/useContracts';
import { Location, useLocationState } from '@hooks/useLocationState';
import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters.ts';
import { fromSqd, isOwned } from '@lib/network';

import { AddWorkerButton } from './AddNewWorker';

export function MyWorkers() {
  const { address } = useAccount();
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
    <>
      <SectionHeader
        title={<SquaredChip label="My Workers" color="primary" />}
        action={
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
        }
      />
      <Card>
        <DashboardTable loading={isLoading} sx={{ mx: -2 }}>
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
                    <ClickableTableRow key={worker.peerId} to={`/worker/${worker.peerId}`}>
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
                      <TableCell>
                        {worker.apr != null ? percentFormatter(worker.apr) : '-'}
                      </TableCell>
                      <TableCell>
                        {tokenFormatter(fromSqd(worker.totalReward), SQD_TOKEN)}
                      </TableCell>
                      <InteractiveCell>
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
                              disabled={!isOwned(worker, address)}
                            />
                          ) : (
                            <WorkerUnregisterButton
                              worker={worker}
                              source={worker.owner}
                              disabled={
                                !isOwned(worker, address) || worker.status !== WorkerStatus.Active
                              }
                            />
                          )}
                        </Box>
                      </InteractiveCell>
                    </ClickableTableRow>
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
      </Card>
    </>
  );
}

export function WorkersPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyWorkers />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
