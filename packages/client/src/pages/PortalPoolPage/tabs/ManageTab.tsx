import { useMemo } from 'react';

import { dateFormat } from '@i18n';
import { Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useReadContract } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { useContracts } from '@hooks/network/useContracts';
import { useCountdown } from '@hooks/useCountdown';
import { tokenFormatter } from '@lib/formatters/formatters';

import { EditCapacityButton, EditDistributionRateButton } from '../dialogs/EditSettingsDialog';
import { TopUpButton } from '../dialogs/TopUpDialog';
import { usePoolData } from '../hooks';

const RUNWAY_WARNING_THRESHOLD_MS = 12 * 24 * 60 * 60 * 1000; // 5 minutes

function RunwayValue({ endsAt }: { endsAt: Date }) {
  const now = Date.now();
  const isExpired = endsAt.getTime() <= now;
  const isWarning = endsAt.getTime() - now < RUNWAY_WARNING_THRESHOLD_MS;
  const timeLeft = useCountdown({ timestamp: endsAt });
  const formattedDate = dateFormat(endsAt, 'dateTime');

  return (
    <Tooltip title={formattedDate ?? ''}>
      <Typography component="span" sx={{ color: isWarning ? 'warning.main' : 'inherit' }}>
        {isExpired ? 'Out of rewards' : timeLeft}
      </Typography>
    </Tooltip>
  );
}

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
    return (
      pool.phase !== 'collecting' &&
      pool.phase !== 'debt' &&
      pool.phase !== 'failed' &&
      pool.phase !== 'closed'
    );
  }, [pool?.phase]);

  if (!pool && !poolLoading) return null;

  return (
    <Stack spacing={2}>
      <Card title={<span>Pool Status</span>}>
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Rewards Balance</span>
                  <HelpTooltip title="Total rewards available for distribution to providers." />
                </Stack>
              </Typography>
              <Typography>
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

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Runway</span>
                  <HelpTooltip title="Estimated time until rewards run out at the current distribution rate. Top up the pool before this date to keep rewards flowing." />
                </Stack>
              </Typography>
              <Typography>
                {poolLoading ? (
                  <Skeleton width={120} />
                ) : pool!.runwayEndsAt ? (
                  <RunwayValue endsAt={pool!.runwayEndsAt} />
                ) : (
                  '—'
                )}
              </Typography>
            </Stack>
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
                  <HelpTooltip title="Daily reward amount distributed to providers. Monthly payout = rate × 30 days." />
                </Stack>
              </Typography>
              <Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>
                    {poolLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      `${pool!.distributionRatePerSecond.times(86400).toFixed(2)} ${pool!.rewardToken.symbol}/day`
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
                  <span>Max Pool Capacity</span>
                  <HelpTooltip
                    title={`Maximum ${SQD_TOKEN} that can be provided. Higher capacity allows more providers to participate.`}
                  />
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
