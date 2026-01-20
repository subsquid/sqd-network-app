import { useMemo } from 'react';

import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useReadContract } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { tokenFormatter } from '@lib/formatters/formatters';
import { useContracts } from '@hooks/network/useContracts';

import { EditCapacityButton, EditDistributionRateButton } from '../dialogs/EditSettingsDialog';
import { TopUpButton } from '../dialogs/TopUpDialog';
import { usePoolData } from '../hooks';
import { MANAGE_TEXTS } from '../texts';

interface ManageTabProps {
  poolId: string;
}

export function ManageTab({ poolId }: ManageTabProps) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { SQD_TOKEN } = useContracts();

  const { data: rewardBalance, isLoading: rewardBalanceLoading } = useReadContract({
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

  if (!pool && !poolLoading) return null;

  return (
    <Stack spacing={2}>
      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>{MANAGE_TEXTS.rewardPoolBalance.label}</span>
            <HelpTooltip title={MANAGE_TEXTS.rewardPoolBalance.tooltip} />
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {poolLoading || rewardBalanceLoading ? (
                <Skeleton width="50%" />
              ) : (
                tokenFormatter(
                  BigNumber(rewardBalance || 0).div(10 ** pool!.rewardToken.decimals),
                  pool!.rewardToken.symbol,
                  6,
                )
              )}
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
            <span>{MANAGE_TEXTS.poolSettings}</span>
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{MANAGE_TEXTS.distributionRate.label}</span>
                  <HelpTooltip title={MANAGE_TEXTS.distributionRate.tooltip} />
                </Stack>
              </Typography>
              <Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>
                    {poolLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      `${pool!.distributionRatePerSecond.times(86400).toFixed(2)} ${pool!.rewardToken.symbol}${MANAGE_TEXTS.distributionRate.unit}`
                    )}
                  </span>
                  {!poolLoading && (
                    <EditDistributionRateButton poolId={poolId} disabled={!canEdit} />
                  )}
                </Stack>
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{MANAGE_TEXTS.maxPoolCapacity.label}</span>
                  <HelpTooltip title={MANAGE_TEXTS.maxPoolCapacity.tooltip(SQD_TOKEN)} />
                </Stack>
              </Typography>
              <Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>
                    {poolLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      tokenFormatter(pool!.tvl.max, SQD_TOKEN, 0)
                    )}
                  </span>
                  {!poolLoading && <EditCapacityButton poolId={poolId} disabled={!canEdit} />}
                </Stack>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
