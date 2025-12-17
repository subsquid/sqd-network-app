import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';

import { useTokenPrice } from '@api/price';
import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PoolData } from './usePoolData';
import { ProvideButton } from './ProvideDialog';
import { WithdrawButton } from './WithdrawDialog';
import { Card } from '@components/Card';

const USDC_ARBITRUM = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  decimals: 6,
  symbol: 'USDC',
};

interface DelegateTabProps {
  pool: PoolData;
}

export function DelegateTab({ pool }: DelegateTabProps) {
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });

  const balance = fromSqd(pool.userBalance);
  const balanceNumber = balance.toNumber();
  const balanceInUsd = sqdPrice ? balanceNumber * sqdPrice : undefined;

  // Rewards are in USDC (6 decimals)
  const rewards = new BigNumber(pool.userRewards.toString()).div(
    new BigNumber(10).pow(USDC_ARBITRUM.decimals),
  );
  const rewardsNumber = rewards.toNumber();

  const hasRewards = pool.userRewards > BigInt(0);

  const handleClaimRewards = async () => {
    // TODO: Implement claim rewards functionality
    // Example: await claimRewards(pool.id);
  };

  return (
    <Stack spacing={2}>
      <Card title="Current Balance">
        {/* Current Balance Section */}

        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {tokenFormatter(balance, SQD_TOKEN, 2)}
        </Typography>
        {balanceInUsd !== undefined && (
          <Typography variant="h4" color="text.secondary">
            ≈ {dollarFormatter(balanceInUsd)}
          </Typography>
        )}
        <Stack spacing={1} sx={{ mt: 2 }}>
          <ProvideButton pool={pool} />
          <WithdrawButton pool={pool} />
        </Stack>
      </Card>

      {/* Available Rewards Section */}
      <Card title="Available Rewards">
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {tokenFormatter(rewards, USDC_ARBITRUM.symbol, 2)}
        </Typography>
        <Typography variant="h4" color="text.secondary">
          ≈ {dollarFormatter(rewardsNumber)}
        </Typography>
        <Button
          variant="outlined"
          color="info"
          fullWidth
          onClick={handleClaimRewards}
          disabled={!hasRewards}
          sx={{ mt: 2 }}
        >
          CLAIM
        </Button>
      </Card>
    </Stack>
  );
}
