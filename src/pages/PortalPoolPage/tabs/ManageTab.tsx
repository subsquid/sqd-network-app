import { Divider, Stack, Typography } from '@mui/material';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { Property, PropertyList } from '@components/Property';
import { useRewardToken } from '@hooks/useRewardToken';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { EditCapacityButton, EditDistributionRateButton } from '../dialogs/EditSettingsDialog';
import { TopUpButton } from '../dialogs/TopUpDialog';
import { usePoolData } from '../hooks';
import { useMemo } from 'react';

interface ManageTabProps {
  poolId: string;
}

export function ManageTab({ poolId }: ManageTabProps) {
  const { data: pool } = usePoolData(poolId);
  const { SQD_TOKEN } = useContracts();
  const { data: rewardToken } = useRewardToken();

  const { data: rewardBalance } = useReadContract({
    address: poolId as `0x${string}`,
    abi: portalPoolAbi,
    functionName: 'getCurrentRewardBalance',
    query: {
      enabled: !!poolId,
    },
  });

  const canEdit = useMemo(() => {
    if (!pool?.phase) return false;
    return pool.phase !== 'collecting' && pool.phase !== 'debt' && pool.phase !== 'failed';
  }, [pool?.phase]);

  if (!pool) return null;

  const rewardDecimals = rewardToken?.decimals ?? 6;
  const rewardSymbol = rewardToken?.symbol ?? 'USDC';
  const formattedBalance = rewardBalance ? formatUnits(rewardBalance, rewardDecimals) : '0';

  return (
    <Card sx={{ height: '100%', overflowY: 'auto' }}>
      <Stack spacing={3} divider={<Divider />}>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Reward Pool Balance
            </Typography>
            <HelpTooltip title="Total rewards available for distribution to delegators." />
          </Stack>
          <Typography variant="body1">
            {tokenFormatter(Number(formattedBalance), rewardSymbol, 6)}
          </Typography>
        </Stack>

        <TopUpButton poolId={poolId} />

        <Stack spacing={2}>
          <Typography variant="subtitle2">Configurable Settings</Typography>
          <PropertyList>
            <Property
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Distribution Rate</span>
                  <HelpTooltip title="Daily reward amount distributed to delegators. Monthly payout = rate × 30 days." />
                </Stack>
              }
              value={`${(pool.monthlyPayoutUsd / 30).toFixed(2)} ${rewardSymbol}/day`}
              action={<EditDistributionRateButton poolId={poolId} disabled={!canEdit} />}
            />
            <Property
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Max Pool Capacity</span>
                  <HelpTooltip title="Maximum SQD that can be deposited in this pool." />
                </Stack>
              }
              value={tokenFormatter(fromSqd(pool.tvl.max), SQD_TOKEN, 0)}
              action={<EditCapacityButton poolId={poolId} disabled={!canEdit} />}
            />
          </PropertyList>
        </Stack>
      </Stack>
    </Card>
  );
}
