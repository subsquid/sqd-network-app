import { dateFormat } from '@i18n';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { SortDir, WorkerSortBy, useMyDelegations, useMySources } from '@api/subsquid-network-squid';
import { trpc } from '@api/trpc';
import { Card } from '@components/Card';
import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';
import { SectionHeader } from '@components/SectionHeader';
import {
  ClickableTableRow,
  DashboardTable,
  InteractiveCell,
  NoItems,
  SortableHeaderCell,
} from '@components/Table';
import {
  DelegationCapacity,
  WorkerDelegate,
  WorkerName,
  WorkerStatusChip,
  WorkerUndelegate,
} from '@components/Worker';
import { DAY_MS, type L1Clock, l1BlockToTimestamp } from '@components/Worker/delegationLock';
import { useContracts } from '@hooks/network/useContracts';
import { Location, useLocationState } from '@hooks/useLocationState';
import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters.ts';
import { fromSqd } from '@lib/network';

import { RelockAllButton } from './RelockAll';

function UnlocksIn({ block, clock }: { block?: number; clock?: L1Clock }) {
  if (!block) return <>Unlocked</>;
  if (!clock) return <>-</>;

  const unlock = l1BlockToTimestamp(block, clock);
  const left = unlock - new Date(clock.lastBlockTimestampL1).getTime();
  if (left <= 0) return <>Unlocked</>;

  const days = Math.floor(left / DAY_MS);

  return (
    <>
      {days >= 1 ? `${days} day${days === 1 ? '' : 's'}` : 'less than a day'} (
      {dateFormat(unlock, 'date')})
    </>
  );
}

export function MyDelegations() {
  const [query, setQuery] = useLocationState({
    // Delegations that can be undelegated right now come first, then the soonest to unlock.
    sortBy: new Location.Enum<WorkerSortBy>(WorkerSortBy.MyDelegationUnlock),
    sortDir: new Location.Enum<SortDir>(SortDir.Asc),
  });

  const { data: delegations, isLoading: isDelegationsLoading } = useMyDelegations({
    sortBy: query.sortBy as WorkerSortBy,
    sortDir: query.sortDir as SortDir,
  });
  const { data: sources, isLoading: isSourcesLoading } = useMySources({});

  const { SQD_TOKEN } = useContracts();

  const { data: currentEpoch } = useQuery(
    trpc.network.currentEpoch.queryOptions(undefined, { refetchInterval: 12_000 }),
  );

  const isLoading = isDelegationsLoading || isSourcesLoading;

  return (
    <>
      <SectionHeader
        title="My Delegations"
        action={<RelockAllButton workers={delegations} disabled={isLoading} />}
      />
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
                sort={WorkerSortBy.MyDelegationUnlock}
                query={query}
                setQuery={setQuery}
                help="When this delegation can be undelegated. Delegating again to the same worker, even 0, restarts the lock."
              >
                Unlocks in
              </SortableHeaderCell>
              <SortableHeaderCell
                sort={WorkerSortBy.MyDelegationReward}
                query={query}
                setQuery={setQuery}
                help="Per-delegation reward totals come from the indexer and may be slightly out of date. The aggregated Claimable balance shown on the Assets page is read directly from the on-chain rewards contract and is always accurate."
              >
                Total reward
              </SortableHeaderCell>
              <TableCell className="pinned"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {delegations.length ? (
              delegations.map(worker => (
                <ClickableTableRow key={worker.peerId} to={`/worker/${worker.peerId}`}>
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
                    <UnlocksIn block={worker.myDelegationUnlockBlock} clock={currentEpoch} />
                  </TableCell>
                  <TableCell>
                    {tokenFormatter(fromSqd(worker.myTotalDelegationReward), SQD_TOKEN)}
                  </TableCell>
                  <InteractiveCell className="pinned">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <WorkerDelegate
                        worker={worker}
                        sources={sources}
                        delegations={worker.delegations.map(d => ({
                          id: d.owner.id,
                          balance: d.deposit,
                        }))}
                      />
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
                  </InteractiveCell>
                </ClickableTableRow>
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
