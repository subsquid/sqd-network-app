import { type ReactNode, useMemo } from 'react';

import { Avatar, Box, Link, Stack, Typography } from '@mui/material';

import { useTokenPrice } from '@api/price';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { useRewardToken } from '@hooks/useRewardToken';
import {
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';
import { useContracts } from '@network/useContracts';

import { usePoolData } from './hooks';
import { USDC_LOGO_URL } from './utils/constants';
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
  const { data: pool } = usePoolData(poolId);
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const { address: rewardTokenAddress, data: rewardToken } = useRewardToken();

  // APY = (Annual Rewards) / (Capacity in USD)
  // Since rewards are constant: Annual = Monthly × 12
  const displayApy = useMemo(() => {
    if (!pool) return 0;
    const calculatedApyRatio =
      calculateApy(pool.monthlyPayoutUsd, pool.tvl.max.toNumber(), sqdPrice) || 0;
    return calculatedApyRatio * 100;
  }, [pool, sqdPrice]);

  if (!pool) return null;

  const apyTooltip =
    'APY = (Monthly Payout × 12) / (Max Pool Capacity × SQD Price)\nCalculated using current SQD price.';

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'stretch', width: '100%' }}
    >
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="TVL"
          tooltip="Total Value Locked - current deposits relative to maximum pool capacity."
          value={
            <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
              <Typography variant="h6" component="span">
                {numberCompactFormatter(pool.tvl.total.toNumber())}
              </Typography>
              <Typography variant="h6" component="span">
                / {numberCompactFormatter(pool.tvl.max.toNumber())} {SQD_TOKEN}
              </Typography>
            </Stack>
          }
        />
      </Card>
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="APY"
          tooltip={apyTooltip}
          value={<Typography variant="h6">{percentFormatter(displayApy)}</Typography>}
        />
      </Card>
      <Card sx={{ flex: 1 }}>
        <StatItem
          label="Total Funded"
          value={
            <Typography variant="h6">
              <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                <Typography variant="h6">
                  {tokenFormatter(pool.monthlyPayoutUsd, rewardToken?.symbol ?? 'USDC', 0)}
                </Typography>
                {rewardTokenAddress && (
                  <Link
                    href={`https://arbiscan.io/token/${rewardTokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar
                      src={USDC_LOGO_URL}
                      alt={rewardToken?.symbol}
                      sx={{ width: '1.5rem', height: '1.5rem' }}
                    />
                  </Link>
                )}
              </Stack>
            </Typography>
          }
          tooltip="Fixed monthly amount paid to SQD liquidity providers"
        />
      </Card>
    </Stack>
  );
}
