import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { SortDir, WorkerSortBy, useMyDelegations, useMySources } from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { SectionHeader } from '@components/SectionHeader';
import { DashboardTable, NoItems, SortableHeaderCell } from '@components/Table';
import {
  DelegationCapacity,
  WorkerDelegate,
  WorkerName,
  WorkerStatusChip,
  WorkerUndelegate,
} from '@components/Worker';
import { Location, useLocationState } from '@hooks/useLocationState';
import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters.ts';
import { fromSqd } from '@lib/network';
import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';
import { useContracts } from '@hooks/network/useContracts';

export function MyDelegations() {
  const [query, setQuery] = useLocationState({
    sortBy: new Location.Enum<WorkerSortBy>(WorkerSortBy.MyDelegationReward),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
  });

  const { data: delegations, isLoading: isDelegationsLoading } = useMyDelegations({
    sortBy: query.sortBy as WorkerSortBy,
    sortDir: query.sortDir as SortDir,
  });
  const { data: sources, isLoading: isSourcesLoading } = useMySources({});

  const { SQD_TOKEN } = useContracts();

  const isLoading = isDelegationsLoading || isSourcesLoading;

  return (
    <>
      <SectionHeader title="My Delegations" />
      <Card>
        <DashboardTable loading={isLoading} sx={{ mx: -2 }}>
          <TableHead>
            <TableRow>
              <SortableHeaderCell
                sort={WorkerSortBy.Name}
                query={query}
                setQuery={setQuery}
                sx={{ width: 300 }}
              >
                Worker
              </SortableHeaderCell>
              <TableCell>Status</TableCell>
              <SortableHeaderCell sort={WorkerSortBy.StakerAPR} query={query} setQuery={setQuery}>
                Delegator APR
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.DelegationCapacity}
                query={query}
                setQuery={setQuery}
              >
                Delegation capacity
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.MyDelegation}
                query={query}
                setQuery={setQuery}
              >
                My Delegation
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.MyDelegationReward}
                query={query}
                setQuery={setQuery}
              >
                Total reward
              </SortableHeaderCell>
              <TableCell className="pinned"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {delegations.length ? (
              delegations.map(worker => (
                <TableRow key={worker.peerId}>
                  <TableCell className="pinned">
                    <WorkerName worker={worker} />
                  </TableCell>
                  <TableCell>
                    <WorkerStatusChip worker={worker} />
                  </TableCell>
                  <TableCell>
                    {worker.stakerApr != null ? percentFormatter(worker.stakerApr) : '-'}
                  </TableCell>
                  <TableCell>
                    <DelegationCapacity worker={worker} />
                  </TableCell>
                  <TableCell>{tokenFormatter(fromSqd(worker.myDelegation), SQD_TOKEN)}</TableCell>
                  <TableCell>
                    {tokenFormatter(fromSqd(worker.myTotalDelegationReward), SQD_TOKEN)}
                  </TableCell>
                  <TableCell className="pinned">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <WorkerDelegate worker={worker} sources={sources} />
                      <WorkerUndelegate
                        worker={worker}
                        sources={worker.delegations.map(d => ({
                          id: d.owner.id,
                          type: d.owner.type,
                          balance: d.deposit,
                          locked: d.locked || false,
                          lockEnd: d.lockEnd,
                        }))}
                        disabled={isLoading}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : isLoading ? null : (
              <NoItems />
            )}
          </TableBody>
        </DashboardTable>
      </Card>
    </>
  );
}

export function DelegationsPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyDelegations />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
