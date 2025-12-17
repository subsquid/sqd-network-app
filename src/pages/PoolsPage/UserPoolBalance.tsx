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

export function UserPoolBalance({ pool }: UserPoolBalanceProps) {
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const balance = fromSqd(pool.userBalance);
  const balanceNumber = balance.toNumber();
  const balanceInUsd = sqdPrice ? balanceNumber * sqdPrice : undefined;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Stack>
        <Typography variant="h6">{tokenFormatter(balance, SQD_TOKEN, 2)}</Typography>
        {balanceInUsd !== undefined && balanceInUsd > 0 && (
          <Typography color="text.secondary">≈ {dollarFormatter(balanceInUsd)}</Typography>
        )}
      </Stack>
    </Stack>
  );
}
