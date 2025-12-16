import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { useTokenPrice } from '@api/price';
import { dollarFormatter, percentFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PoolData } from './usePoolData';

interface UserPoolBalanceProps {
  pool: PoolData;
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

export function UserPoolBalance({ pool }: UserPoolBalanceProps) {
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const balance = fromSqd(pool.userBalance);
  const balanceNumber = balance.toNumber();
  const balanceInUsd = sqdPrice ? balanceNumber * sqdPrice : undefined;

  // Calculate APY using max TVL (pool capacity)
  const maxTvl = fromSqd(pool.tvl.max).toNumber();
  const calculatedApyRatio = calculateApy(pool.monthlyPayoutUsd, maxTvl, sqdPrice);
  const displayApy = calculatedApyRatio !== undefined ? calculatedApyRatio * 100 : pool.apy * 100;

  const apyTooltip =
    'APY = (Monthly Payout × 12) / (Pool Capacity × SQD Price)\nBased on full pool capacity and live SQD price.';

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Your Balance
        </Typography>
        <Stack spacing={0}>
          <Typography variant="h5">{tokenFormatter(balance, SQD_TOKEN, 2)}</Typography>
          {balanceInUsd !== undefined && balanceInUsd > 0 && (
            <Typography variant="body2" color="text.secondary">
              ≈ {dollarFormatter(balanceInUsd)}
            </Typography>
          )}
        </Stack>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Expected APY
          </Typography>
          <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{apyTooltip}</span>} placement="top">
            <Info sx={{ fontSize: 14, color: 'text.secondary', cursor: 'help' }} />
          </Tooltip>
        </Stack>
        <Typography variant="h5" color="success.main">
          {percentFormatter(displayApy)}
        </Typography>
      </Box>
    </Stack>
  );
}
