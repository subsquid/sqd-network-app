import { Box, Button, Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, Outlet, Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';

import { SortDir, useMySources } from '@api/subsquid-network-squid';
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
import { AddPortalButton } from './AddNewPortalPool';
import { useAccount } from '@network/useAccount';
import { useReadContract, useReadContracts } from 'wagmi';
import { portalPoolFactoryAbi, portalPoolAbi } from '@api/contracts';
import { unwrapMulticallResult } from '@lib/network';
import { parseMetadata } from '@pages/PortalPoolPage/hooks';

enum PortalSortBy {
  Name = 'name',
}

function PortalName({ name, address }: { name: string; address: string }) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <RouterLink to={`/portal-pool/${address}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
    sortBy: new Location.Enum<PortalSortBy>(PortalSortBy.Name),
    sortDir: new Location.Enum<SortDir>(SortDir.Asc),
  });

  const { SQD_TOKEN, PORTAL_POOL_FACTORY } = useContracts();
  const { address } = useAccount();
  const { data: sources, isLoading: isSourcesLoading } = useMySources();

  const { data: portalAddresses, isLoading: isPortalsLoading } = useReadContract({
    address: PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'getOperatorPortals',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const portalContracts = useMemo(() => {
    if (!portalAddresses) return [];

    return portalAddresses.map(
      portalAddress =>
        ({
          address: portalAddress,
          abi: portalPoolAbi,
          functionName: 'getMetadata',
        }) as const,
    );
  }, [portalAddresses]);

  const { data: portalsData, isLoading: isPortalsDataLoading } = useReadContracts({
    contracts: portalContracts,
    query: {
      enabled: portalContracts.length > 0,
    },
  });

  const myPortals = useMemo(() => {
    if (!portalAddresses || !portalsData) return [];

    const portals = portalAddresses
      .map((portalAddress, index) => {
        const portalInfo = unwrapMulticallResult(portalsData[index]);

        if (!portalInfo) return;

        return {
          address: portalAddress,
          name: parseMetadata(portalInfo).name || portalAddress,
        };
      })
      .filter((portal): portal is NonNullable<typeof portal> => portal !== null);

    return portals.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return query.sortDir === SortDir.Asc ? comparison : -comparison;
    });
  }, [portalAddresses, portalsData, query.sortDir]);

  const isLoading = isSourcesLoading || isPortalsLoading || isPortalsDataLoading;

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
        <DashboardTable loading={isLoading} sx={{ mx: -2, mb: -2 }}>
          <>
            <TableHead>
              <TableRow>
                <SortableHeaderCell sort={PortalSortBy.Name} query={query} setQuery={setQuery}>
                  Portal
                </SortableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myPortals.length ? (
                myPortals.map(portal => (
                  <TableRow key={portal.address}>
                    <TableCell>
                      <PortalName name={portal.name} address={portal.address} />
                    </TableCell>
                  </TableRow>
                ))
              ) : isLoading ? null : (
                <NoItems>
                  <span>No portals yet</span>
                </NoItems>
              )}
            </TableBody>
          </>
        </DashboardTable>
      </Card>
    </>
  );
}

export function PortalPoolsPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyPortals />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
