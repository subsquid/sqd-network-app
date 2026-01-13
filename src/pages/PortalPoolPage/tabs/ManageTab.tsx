import { useMemo } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { useRewardToken } from '@hooks/useRewardToken';
import { tokenFormatter } from '@lib/formatters/formatters';
import { useContracts } from '@network/useContracts';

import { EditCapacityButton, EditDistributionRateButton } from '../dialogs/EditSettingsDialog';
import { TopUpButton } from '../dialogs/TopUpDialog';
import { usePoolData } from '../hooks';

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

  const { rewardDecimals, rewardSymbol, formattedBalance } = useMemo(
    () => ({
      rewardDecimals: rewardToken?.decimals ?? 6,
      rewardSymbol: rewardToken?.symbol ?? 'USDC',
      formattedBalance: rewardBalance
        ? formatUnits(rewardBalance, rewardToken?.decimals ?? 6)
        : '0',
    }),
    [rewardToken, rewardBalance],
  );

  if (!pool) return null;

  return (
    <Stack spacing={2}>
      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>Reward Balance</span>
            <HelpTooltip title="Total rewards available for distribution to delegators." />
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {tokenFormatter(Number(formattedBalance), rewardSymbol, 6)}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <TopUpButton poolId={poolId} />
          </Stack>
        </Stack>
      </Card>

      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>Pool Settings</span>
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Distribution Rate</span>
                  <HelpTooltip title="Daily reward amount distributed to delegators. Monthly payout = rate × 30 days." />
                </Stack>
              </Typography>
              <Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{`${(pool.monthlyPayoutUsd / 30).toFixed(2)} ${rewardSymbol}/day`}</span>
                  <EditDistributionRateButton poolId={poolId} disabled={!canEdit} />
                </Stack>
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Max Pool Capacity</span>
                  <HelpTooltip title="Maximum SQD that can be deposited in this pool." />
                </Stack>
              </Typography>
              <Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{tokenFormatter(pool.tvl.max, SQD_TOKEN, 0)}</span>
                  <EditCapacityButton poolId={poolId} disabled={!canEdit} />
                </Stack>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
