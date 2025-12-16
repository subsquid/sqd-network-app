import { MockPortal, useMockPortals } from '@api/portal-pools';
import { SortDir, useMySources } from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Search } from '@components/Search/Search';
import { SectionHeader } from '@components/SectionHeader';
import { NameWithAvatar } from '@components/SourceWalletName';
import { DashboardTable, NoItems, SortableHeaderCell } from '@components/Table';
import { BarWrapper, StyledBar } from '@components/Worker/DelegationCapacity';
import { Location, useLocationState } from '@hooks/useLocationState';
import { dateFormat } from '@i18n';
import { percentFormatter } from '@lib/formatters/formatters';
import { Box, Chip, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatUnits } from 'viem';
import { PortalDelegate } from './PortalDelegate';

enum PortalSortBy {
  Name = 'name',
  Status = 'status',
  Capacity = 'capacity',
  DailyRate = 'dailyRate',
  Created = 'created',
}

function PortalStateChip({ state }: { state: number }) {
  const stateMap = {
    0: { label: 'Accepting', color: 'primary' as const },
    1: { label: 'Active', color: 'success' as const },
    2: { label: 'Inactive', color: 'error' as const },
  };

  const stateInfo = stateMap[state as keyof typeof stateMap] || {
    label: 'Unknown',
    color: 'default' as const,
  };

  return <Chip label={stateInfo.label} color={stateInfo.color} size="small" />;
}

const BARS_COUNT = 5;
const RANGES = Array.from({ length: BARS_COUNT }, (_, i) => (i * 100) / BARS_COUNT);

function PortalCapacity({ portal }: { portal: MockPortal }) {
  const capacityPercent = (Number(portal.totalStaked) / Number(portal.maxCapacity)) * 100;
  const color = capacityPercent >= 80 ? 'error' : capacityPercent >= 40 ? 'warning' : 'success';

  return (
    <>
      <BarWrapper>
        {RANGES.map((v, i) => (
          <StyledBar
            key={i}
            className={classNames(v < capacityPercent || i === 0 ? color : undefined)}
          />
        ))}
      </BarWrapper>
      {percentFormatter(capacityPercent)}
    </>
  );
}

function PortalName({ portal }: { portal: Pick<MockPortal, 'name' | 'address'> }) {
  const shortAddress = `${portal.address.slice(0, 6)}...${portal.address.slice(-4)}`;

  return (
    <RouterLink to={`/portal/${portal.address}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <NameWithAvatar
        title={portal.name}
        subtitle={<CopyToClipboard text={portal.address} content={shortAddress} />}
        avatarValue={portal.address}
      />
    </RouterLink>
  );
}

export function MockPortals() {
  const { mockPortals, mockProviders, mockUserAddress, stakeMock, requestExitMock } = useMockPortals();
  
  const userProvider = mockProviders.find(p => p.address === mockUserAddress);
  const { data: sources } = useMySources();

  const [query, setQuery] = useLocationState({
    search: new Location.String(''),
    sortBy: new Location.Enum<PortalSortBy>(PortalSortBy.Created),
    sortDir: new Location.Enum<SortDir>(SortDir.Desc),
  });

  const filteredAndSortedPortals = useMemo(() => {
    let result = [...mockPortals];

    // Filter by search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      result = result.filter(
        portal =>
          portal.name.toLowerCase().includes(searchLower) ||
          portal.address.toLowerCase().includes(searchLower),
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (query.sortBy) {
        case PortalSortBy.Name:
          comparison = a.name.localeCompare(b.name);
          break;
        case PortalSortBy.Status:
          comparison = a.state - b.state;
          break;
        case PortalSortBy.Capacity:
          const aCapacity = Number(a.totalStaked) / Number(a.maxCapacity);
          const bCapacity = Number(b.totalStaked) / Number(b.maxCapacity);
          comparison = aCapacity - bCapacity;
          break;
        case PortalSortBy.DailyRate:
          comparison = Number(a.expectedRatePerDay - b.expectedRatePerDay);
          break;
        case PortalSortBy.Created:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }

      return query.sortDir === SortDir.Asc ? comparison : -comparison;
    });

    return result;
  }, [mockPortals, query.search, query.sortBy, query.sortDir]);

  return (
    <>
      <Box>
        <SectionHeader
          title={<Search placeholder="Search" value={query.search} onChange={setQuery.search} />}
        />
      </Box>
      <Card>
        <DashboardTable loading={false} minHeight={300} sx={{ m: -2, mt: -0.5 }}>
          <TableHead>
            <TableRow>
              <SortableHeaderCell sort={PortalSortBy.Name} query={query} setQuery={setQuery}>
                Pool
              </SortableHeaderCell>
              <SortableHeaderCell sort={PortalSortBy.Status} query={query} setQuery={setQuery}>
                Status
              </SortableHeaderCell>
              <SortableHeaderCell sort={PortalSortBy.Capacity} query={query} setQuery={setQuery}>
                Capacity
              </SortableHeaderCell>
              <SortableHeaderCell sort={PortalSortBy.DailyRate} query={query} setQuery={setQuery}>
                Daily Rate
              </SortableHeaderCell>
              <SortableHeaderCell sort={PortalSortBy.Created} query={query} setQuery={setQuery}>
                Created
              </SortableHeaderCell>
              <TableCell className="pinned"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedPortals.length ? (
              filteredAndSortedPortals.map(portal => (
                <TableRow key={portal.address}>
                  <TableCell className="pinned">
                    <PortalName portal={portal} />
                  </TableCell>
                  <TableCell>
                    <PortalStateChip state={portal.state} />
                  </TableCell>
                  <TableCell>
                    <PortalCapacity portal={portal} />
                  </TableCell>
                  <TableCell>{formatUnits(portal.expectedRatePerDay, 6)} USDC</TableCell>
                  <TableCell>{dateFormat(portal.createdAt)}</TableCell>
                  <TableCell className="pinned">
                    <Box display="flex" justifyContent="flex-end">
                      <PortalDelegate
                        portal={portal}
                        sources={sources}
                        onDeposit={stakeMock}
                        onWithdraw={requestExitMock}
                        userStake={userProvider?.stakes[portal.address]}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoItems />
            )}
          </TableBody>
        </DashboardTable>
      </Card>
    </>
  );
}
