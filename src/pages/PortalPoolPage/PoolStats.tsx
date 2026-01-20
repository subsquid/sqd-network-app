import { type ReactNode, useMemo } from 'react';

import { Box, Skeleton, Stack, Typography } from '@mui/material';

import { useTokenPrice } from '@api/price';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import {
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';
import { useContracts } from '@network/useContracts';

import { usePoolData } from './hooks';
import { STATS_TEXTS } from './texts';
import { calculateApy } from './utils/poolUtils';

interface PoolStatsProps {
  poolId: string;
}

function StatItem({
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
      <Typography variant="body2" color="text.secondary" noWrap>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>{label}</span>
          {tooltip && <HelpTooltip title={tooltip} />}
        </Stack>
      </Typography>
      <Box sx={{ '& > *': { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
}

export function PoolStats({ poolId }: PoolStatsProps) {
  const { data: pool, isLoading } = usePoolData(poolId);
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });

  // APY = (Annual Rewards) / (Capacity in USD)
  // Since rewards are constant: Annual = Monthly × 12
  const displayApy = useMemo(() => {
    if (!pool) return 0;
    const calculatedApyRatio =
      calculateApy(
        pool.distributionRatePerSecond.times(30 * 86400).toNumber(),
        pool.tvl.max.toNumber(),
        sqdPrice,
      ) || 0;
    return calculatedApyRatio * 100;
  }, [pool, sqdPrice]);

  const apyTooltip = STATS_TEXTS.apy.tooltip(SQD_TOKEN);
  const monthlyPayoutTooltip = STATS_TEXTS.monthlyPayout.tooltip(SQD_TOKEN);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'stretch', width: '100%' }}
    >
      <Card sx={{ flex: 1 }}>
        <StatItem
          label={STATS_TEXTS.tvl.label}
          tooltip={STATS_TEXTS.tvl.tooltip}
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
          label={STATS_TEXTS.apy.label}
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
          label={STATS_TEXTS.monthlyPayout.label}
          value={
            <Typography variant="h6">
              <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                <Typography variant="h6">
                  {isLoading ? (
                    <Skeleton width="50%" />
                  ) : (
                    tokenFormatter(pool!.totalRewardsToppedUp, pool!.rewardToken.symbol, 2)
                  )}
                </Typography>
                {/* {pool.rewardToken && (
                  <Link
                    href={`https://arbiscan.io/token/${pool.rewardToken.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar
                      src={USDC_LOGO_URL}
                      alt={pool.rewardToken.symbol}
                      sx={{ width: '1.5rem', height: '1.5rem' }}
                    />
                  </Link>
                )} */}
              </Stack>
            </Typography>
          }
          tooltip={monthlyPayoutTooltip}
        />
      </Card>
    </Stack>
  );
}
