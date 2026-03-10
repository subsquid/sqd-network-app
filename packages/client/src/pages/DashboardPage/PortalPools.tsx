import { useMemo } from 'react';

import { dateFormat } from '@i18n';
import {
  Chip,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  getPhaseColor,
  getPhaseLabel,
  getPhaseTooltip,
} from '@pages/PortalPoolPage/utils/poolUtils';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import { trpc } from '@api/trpc';
import type { RouterOutput } from '@api/types';
import { Card } from '@components/Card';
import { NameWithAvatar } from '@components/SourceWalletName';
import { ClickableTableRow, DashboardTable, InteractiveCell, NoItems } from '@components/Table';
import { BarWrapper, StyledBar } from '@components/Worker/DelegationCapacity';
import { useContracts } from '@hooks/network/useContracts';
import {
  addressFormatter,
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';

type PortalPool = RouterOutput['pool']['list'][number];

const FILL_BARS = 5;
const FILL_RANGES = Array.from({ length: FILL_BARS }, (_, i) => (i * 100) / FILL_BARS);

function getHealthColor(pool: PortalPool): 'info' | 'error' | 'warning' | 'success' {
  if (pool.phase === 'collecting') return 'info';
  if (pool.phase === 'idle') return 'error';
  if (BigNumber(pool.tvl.current).lt(pool.tvl.min)) return 'warning';
  return 'success';
}

function PoolRow({ pool, sqdPrice }: { pool: PortalPool; sqdPrice?: number }) {
  const { SQD_TOKEN } = useContracts();

  const apy = useMemo(() => {
    const max = BigNumber(pool.tvl.max);
    if (!sqdPrice || sqdPrice <= 0 || max.isZero()) return 0;
    return BigNumber(pool.distributionRatePerSecond)
      .div(max)
      .times(365 * 86400)
      .div(sqdPrice)
      .times(100)
      .toNumber();
  }, [pool.distributionRatePerSecond, pool.tvl.max, sqdPrice]);

  const fillPct = useMemo(() => {
    const max = BigNumber(pool.tvl.max);
    if (max.isZero()) return 0;
    return Math.min(BigNumber(pool.tvl.current).div(max).times(100).toNumber(), 100);
  }, [pool.tvl.current, pool.tvl.max]);

  return (
    <ClickableTableRow to={`/portal-pool/${pool.id}`}>
      <TableCell>
        <NameWithAvatar
          title={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <span>{pool.name ?? addressFormatter(pool.id, true)}</span>
              {pool.whitelistEnabled && (
                <Chip label="Whitelist" size="small" variant="outlined" color="secondary" />
              )}
            </Stack>
          }
          subtitle={addressFormatter(pool.id, true)}
          avatarValue={pool.id}
          sx={{ width: 'auto' }}
        />
      </TableCell>
      <InteractiveCell>
        <Tooltip title={getPhaseTooltip(pool.phase)}>
          <Chip label={getPhaseLabel(pool.phase)} color={getPhaseColor(pool.phase)} size="small" />
        </Tooltip>
      </InteractiveCell>
      <TableCell>{percentFormatter(apy)}</TableCell>
      <TableCell>
        {numberCompactFormatter(pool.tvl.current)} {SQD_TOKEN}
      </TableCell>
      <TableCell>{percentFormatter(fillPct)}</TableCell>
      <TableCell>
        {tokenFormatter(Number(pool.totalRewardsToppedUp), pool.rewardTokenSymbol, 0)}
      </TableCell>
      <TableCell>{dateFormat(pool.createdAt)}</TableCell>
    </ClickableTableRow>
  );
}

export function PortalPools() {
  const { data, isLoading } = useQuery(trpc.pool.list.queryOptions());
  const { data: sqdPrice } = useQuery(trpc.price.current.queryOptions());
  const pools: PortalPool[] = data ?? [];

  return (
    <Card>
      <DashboardTable loading={isLoading}>
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>APY</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Total Funding</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pools.length ? (
            pools.map(pool => (
              <PoolRow key={pool.id} pool={pool} sqdPrice={sqdPrice ?? undefined} />
            ))
          ) : (
            <NoItems />
          )}
        </TableBody>
      </DashboardTable>
    </Card>
  );
}
