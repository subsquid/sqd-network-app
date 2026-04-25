import { type ReactNode, memo, useMemo } from 'react';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { useContracts } from '@hooks/network/useContracts';
import {
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';

import { usePoolData } from './hooks';

interface PoolStatsProps {
  poolId: string;
}

const StatItem = memo(function StatItem({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  tooltip?: string;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        component="span"
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ color: 'text.secondary', typography: 'body2' }}
      >
        <span>{label}</span>
        {tooltip && <HelpTooltip title={tooltip} />}
      </Stack>
      <Box sx={{ '& > *': { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
});

export function PoolStats({ poolId }: PoolStatsProps) {
  const { data: pool, isLoading } = usePoolData(poolId);
  const { SQD_TOKEN } = useContracts();
  const { data: sqdPrice } = useQuery(trpc.price.current.queryOptions());

  // APY = (distributionRatePerSecond / tvl.max) * secondsPerYear / sqdPrice
  // Divide in BigNumber first to preserve precision with large raw values
  const displayApy = useMemo(() => {
    if (!pool || !sqdPrice || sqdPrice <= 0 || pool.tvl.max.isZero()) return 0;
    return pool.distributionRatePerSecond
      .div(pool.tvl.max)
      .times(365 * 86400)
      .div(sqdPrice)
      .times(100)
      .toNumber();
  }, [pool, sqdPrice]);

  const apyTooltip = `APY = (Monthly Payout × 12) / (Max Pool Capacity × ${SQD_TOKEN} Price)\nBased on full pool capacity and live ${SQD_TOKEN} price.`;
  const monthlyPayoutTooltip = 'The total amount of rewards funded to the pool.';

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'stretch', width: '100%' }}
    >
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="TVL"
          tooltip="Total Value Locked: current amount provided to the pool (including pending withdrawals) out of the maximum pool capacity."
          value={
            <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
              <Typography variant="h6" component="span">
                {isLoading ? (
                  <Skeleton width="50%" />
                ) : (
                  numberCompactFormatter(pool!.tvl.total.toNumber())
                )}
              </Typography>
              <Typography variant="h6" component="span">
                {isLoading ? (
                  <Skeleton width="50%" />
                ) : (
                  `/ ${numberCompactFormatter(pool!.tvl.max.toNumber())} ${SQD_TOKEN}`
                )}
              </Typography>
            </Stack>
          }
        />
      </Card>
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="APY"
          tooltip={apyTooltip}
          value={
            <Typography variant="h6">
              {isLoading ? <Skeleton width="50%" /> : percentFormatter(displayApy)}
            </Typography>
          }
        />
      </Card>
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="Total Funding"
          value={
            <Typography variant="h6">
              {isLoading ? (
                <Skeleton width="50%" />
              ) : (
                tokenFormatter(pool!.totalRewardsToppedUp, pool!.rewardToken.symbol, 2)
              )}
            </Typography>
          }
          tooltip={monthlyPayoutTooltip}
        />
      </Card>
    </Stack>
  );
}
