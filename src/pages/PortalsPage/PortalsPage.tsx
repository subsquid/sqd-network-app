import { tokenFormatter } from '@lib/formatters/formatters.ts';
import { Box, Button, Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, Outlet, Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';

import { SortDir, useMySources } from '@api/subsquid-network-squid';
import { useMockPortals } from '@api/portal-pools';
import { DashboardTable, SortableHeaderCell, NoItems } from '@components/Table';
import { Location, useLocationState } from '@hooks/useLocationState';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ConnectedWalletRequired } from '@network/ConnectedWalletRequired';
import { useContracts } from '@network/useContracts';
import { SquaredChip } from '@components/Chip';
import { SectionHeader } from '@components/SectionHeader';
import { Card } from '@components/Card';
import { NameWithAvatar } from '@components/SourceWalletName';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { formatUnits } from 'viem';
import { PortalDelegate } from '@pages/DashboardPage/PortalDelegate';
import { AddPortalButton } from './AddNewPortal';

enum PortalSortBy {
  Name = 'name',
  Staked = 'staked',
  Claimable = 'claimable',
}

function PortalName({ name, address }: { name: string; address: string }) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <RouterLink to={`/portal/${address}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <NameWithAvatar
        title={name}
        subtitle={<CopyToClipboard text={address} content={shortAddress} />}
        avatarValue={address}
      />
    </RouterLink>
  );
}

export function MyPortals() {
  const [query, setQuery] = useLocationState({
    sortBy: new Location.Enum<PortalSortBy>(PortalSortBy.Staked),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
  });

  const { SQD_TOKEN } = useContracts();
  const { data: sources, isLoading: isSourcesLoading } = useMySources();
  const { mockPortals, mockProviders, mockUserAddress, stakeMock, requestExitMock } =
    useMockPortals();

  const userProvider = mockProviders.find(p => p.address === mockUserAddress);

  // Filter portals where user has stake
  const myPortals = useMemo(() => {
    return mockPortals
      .filter(portal => {
        const stake = userProvider?.stakes[portal.address];
        return stake && stake > 0n;
      })
      .map(portal => {
        const stake = userProvider?.stakes[portal.address] || BigInt(0);
        const claimable =
          userProvider?.claimable[portal.address]?.['0xA911Abb691d1F09DF1063cE28D78Ba5f9E1E66A2'] ||
          BigInt(0);
        return { portal, stake, claimable };
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (query.sortBy) {
          case PortalSortBy.Name:
            comparison = a.portal.name.localeCompare(b.portal.name);
            break;
          case PortalSortBy.Staked:
            comparison = Number(a.stake - b.stake);
            break;
          case PortalSortBy.Claimable:
            comparison = Number(a.claimable - b.claimable);
            break;
        }
        return query.sortDir === SortDir.Asc ? comparison : -comparison;
      });
  }, [mockPortals, userProvider, query.sortBy, query.sortDir]);

  const isLoading = isSourcesLoading;

  return (
    <>
      <SectionHeader
        title={<SquaredChip label="My Portals" color="primary" />}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              color="secondary"
              variant="outlined"
              component={Link}
              target="_blank"
              to="https://docs.sqd.dev/subsquid-network/"
            >
              LEARN MORE
            </Button>
            <AddPortalButton disabled={isLoading} sources={sources} />
          </Stack>
        }
      />
      <Card>
        <DashboardTable loading={isLoading} sx={{ mx: -2 }}>
          <>
            <TableHead>
              <TableRow>
                <SortableHeaderCell sort={PortalSortBy.Name} query={query} setQuery={setQuery}>
                  Portal
                </SortableHeaderCell>
                <SortableHeaderCell sort={PortalSortBy.Staked} query={query} setQuery={setQuery}>
                  Your Stake
                </SortableHeaderCell>
                <SortableHeaderCell
                  sort={PortalSortBy.Claimable}
                  query={query}
                  setQuery={setQuery}
                >
                  Claimable
                </SortableHeaderCell>
                <TableCell>Daily Rate</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myPortals.length ? (
                myPortals.map(({ portal, stake, claimable }) => (
                  <TableRow key={portal.address}>
                    <TableCell>
                      <PortalName name={portal.name} address={portal.address} />
                    </TableCell>
                    <TableCell>
                      {tokenFormatter(formatUnits(stake, 18), SQD_TOKEN, 2)}
                    </TableCell>
                    <TableCell>
                      {claimable > 0 ? `$${formatUnits(claimable, 6)} USDC` : '-'}
                    </TableCell>
                    <TableCell>{formatUnits(portal.expectedRatePerDay, 6)} USDC</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="flex-end">
                        <PortalDelegate
                          portal={portal}
                          sources={sources}
                          onDeposit={stakeMock}
                          onWithdraw={requestExitMock}
                          userStake={stake}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : isLoading ? null : (
                <NoItems>
                  <span>No portal stakes yet</span>
                </NoItems>
              )}
            </TableBody>
          </>
        </DashboardTable>
      </Card>
    </>
  );
}

export function PortalsPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyPortals />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
