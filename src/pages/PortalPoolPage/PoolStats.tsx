import type { ReactNode } from 'react';
import { Avatar, Box, Link, Stack, Typography } from '@mui/material';

import {
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

const USDC_ARBITRUM = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040',
  symbol: 'USDC',
};

import type { PoolData } from './usePoolData';
import { useTokenPrice } from '@api/price';
import { HelpTooltip } from '@components/HelpTooltip';

interface PoolStatsProps {
  pool: PoolData;
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

// Calculate APY: (monthlyPayoutUsd * 12) / (tvl * sqdPrice)
function calculateApy(
  monthlyPayoutUsd: number,
  tvlInSqd: number,
  sqdPrice: number | undefined,
): number | undefined {
  if (!sqdPrice || tvlInSqd === 0) return undefined;
  const tvlInUsd = tvlInSqd * sqdPrice;
  const annualPayoutUsd = monthlyPayoutUsd * 12;
  return annualPayoutUsd / tvlInUsd;
}

export function PoolStats({ pool }: PoolStatsProps) {
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });

  const currentTvl = fromSqd(pool.tvl.current);
  const maxTvl = fromSqd(pool.tvl.max);
  const tvlPercent = maxTvl.gt(0) ? currentTvl.div(maxTvl).times(100).toNumber() : 0;

  const calculatedApyRatio = calculateApy(pool.monthlyPayoutUsd, maxTvl.toNumber(), sqdPrice) || 0;

  // Calculate APY using max TVL (pool capacity)
  const displayApy = calculatedApyRatio * 100;

  const apyTooltip =
    'APY = (Monthly Payout × 12) / (Pool Capacity × SQD Price)\nBased on full pool capacity and live SQD price.';

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'space-between', width: '100%' }}
    >
      <StatItem
        label="TVL"
        value={
          <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
            <Typography variant="h6" component="span">
              {numberCompactFormatter(currentTvl.toNumber())}
            </Typography>
            <Typography variant="h6" component="span">
              / {numberCompactFormatter(maxTvl.toNumber())} {SQD_TOKEN}
            </Typography>
          </Stack>
        }
      />
      <StatItem
        label="APY"
        tooltip={apyTooltip}
        value={<Typography variant="h6">{percentFormatter(displayApy)}</Typography>}
      />
      <StatItem
        label="Monthly Payout"
        value={
          <Typography variant="h6">
            <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
              <Typography variant="h6">
                {tokenFormatter(pool.monthlyPayoutUsd, USDC_ARBITRUM.symbol, 0)}
              </Typography>
              <Link
                href={`https://arbiscan.io/token/${USDC_ARBITRUM.address}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Avatar
                  src={USDC_ARBITRUM.logo}
                  alt={USDC_ARBITRUM.symbol}
                  sx={{ width: 24, height: 24 }}
                />
              </Link>
            </Stack>
          </Typography>
        }
        tooltip="Fixed monthly amount paid to SQD liquidity providers"
      />
    </Stack>
  );
}
