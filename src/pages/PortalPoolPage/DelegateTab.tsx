import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';

import { useTokenPrice } from '@api/price';
import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PoolData, PoolUserData, PendingWithdrawal } from './usePoolData';
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
  userData?: PoolUserData;
  pendingWithdrawals?: PendingWithdrawal[];
}

export function DelegateTab({ pool, userData, pendingWithdrawals = [] }: DelegateTabProps) {
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });

  const balance = userData ? fromSqd(userData.userBalance) : BigNumber(0);
  const balanceNumber = balance.toNumber();
  const balanceInUsd = sqdPrice ? balanceNumber * sqdPrice : undefined;

  // Rewards are in USDC (6 decimals)
  const rewards = userData
    ? new BigNumber(userData.userRewards.toString()).div(
        new BigNumber(10).pow(USDC_ARBITRUM.decimals),
      )
    : BigNumber(0);
  const rewardsNumber = rewards.toNumber();

  const hasRewards = userData ? userData.userRewards > BigInt(0) : false;

  const handleClaimRewards = async () => {
    // TODO: Implement claim rewards functionality
    // Example: await claimRewards(pool.id);
  };

  return (
    <Stack spacing={2}>
      <Card title="Current Balance">
        {/* Current Balance Section */}
        <Stack spacing={2} divider={<Divider />}>
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {tokenFormatter(balance, SQD_TOKEN, 2)}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              ≈ {dollarFormatter(balanceInUsd || 0)}
            </Typography>
          </Box>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <ProvideButton pool={pool} userData={userData} />
            <WithdrawButton
              pool={pool}
              userData={userData}
              pendingWithdrawals={pendingWithdrawals}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Available Rewards Section */}
      <Card title="Available Rewards">
        <Stack spacing={2} divider={<Divider />}>
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {tokenFormatter(rewards, USDC_ARBITRUM.symbol, 2)}
            </Typography>
            <Typography variant="h4" color="text.secondary">
              ≈ {dollarFormatter(rewardsNumber || 0)}
            </Typography>
          </Box>
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
        </Stack>
      </Card>
    </Stack>
  );
}
