import type { ReactNode } from 'react';
import { Avatar, Box, Link, Stack, Tooltip, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

const USDC_ARBITRUM = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040',
  symbol: 'USDC',
};

import type { PoolData } from './usePoolData';

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
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltip}</span>} placement="top">
            <Info sx={{ fontSize: 14, color: 'text.secondary', cursor: 'help', flexShrink: 0 }} />
          </Tooltip>
        )}
      </Stack>
      <Box sx={{ '& > *': { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
}

export function PoolStats({ pool }: PoolStatsProps) {
  const { SQD_TOKEN } = useContracts();

  const currentTvl = fromSqd(pool.tvl.current);
  const maxTvl = fromSqd(pool.tvl.max);
  const tvlPercent = maxTvl.gt(0) ? currentTvl.div(maxTvl).times(100).toNumber() : 0;

  return (
    <Stack spacing={2}>
      <StatItem
        label="TVL"
        value={
          <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
            <Typography variant="h6" component="span">
              {tokenFormatter(currentTvl, SQD_TOKEN, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="span">
              / {tokenFormatter(maxTvl, SQD_TOKEN, 0)} ({tvlPercent.toFixed(0)}%)
            </Typography>
          </Stack>
        }
      />
      <Stack direction="row" spacing={3}>
        <StatItem
          label="Monthly Payout"
          value={<Typography variant="h6">{dollarFormatter(pool.monthlyPayoutUsd)}</Typography>}
          tooltip="Fixed monthly amount paid to SQD liquidity providers"
        />
        <StatItem
          label="Currency"
          value={
            <Link
              href={`https://arbiscan.io/token/${USDC_ARBITRUM.address}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  src={USDC_ARBITRUM.logo}
                  alt={USDC_ARBITRUM.symbol}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography variant="h6" color="text.primary">{USDC_ARBITRUM.symbol}</Typography>
              </Stack>
            </Link>
          }
        />
      </Stack>
    </Stack>
  );
}
