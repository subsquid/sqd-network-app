import { useCallback, useMemo } from 'react';

import { Button, Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { useTokenPrice } from '@api/price';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { useContracts } from '@hooks/network/useContracts';

import { ProvideButton } from '../dialogs/ProvideDialog';
import { WithdrawButton } from '../dialogs/WithdrawDialog';
import { type PoolPhase, usePoolData, usePoolUserData } from '../hooks';
import { DELEGATE_TEXTS } from '../texts';
import { invalidatePoolQueries } from '../utils/poolUtils';

interface DelegateTabProps {
  poolId: string;
}

export function DelegateTab({ poolId }: DelegateTabProps) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const isLoading = poolLoading || userDataLoading;

  const balance = userData?.userBalance ?? BigNumber(0);
  const balanceInUsd = sqdPrice ? balance.toNumber() * sqdPrice : undefined;

  const rewards = useMemo(
    () =>
      userData
        ? new BigNumber(userData.userRewards.toString()).div(
            10 ** (pool?.rewardToken.decimals ?? 6),
          )
        : BigNumber(0),
    [userData, pool?.rewardToken.decimals],
  );

  const dailyRewardRate = useMemo(() => {
    if (!pool || !userData || pool.tvl.current.isZero() || pool.phase !== 'active')
      return BigNumber(0);

    // Calculate daily distribution rate: rate per second * seconds in a day / decimals
    const dailyDistribution = pool.distributionRatePerSecond.multipliedBy(86400);

    // Calculate user's share of daily rewards: daily rate * (user balance / total active stake)
    const userShare = balance.div(pool.tvl.max);

    return dailyDistribution.multipliedBy(userShare);
  }, [pool, userData, balance, pool?.rewardToken.decimals]);

  const hasRewards = userData ? userData.userRewards > BigInt(0) : false;

  const handleClaimRewards = useCallback(async () => {
    try {
      await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName: 'claimRewards',
        args: [],
      });
      await invalidatePoolQueries(queryClient, poolId);
    } catch (error) {
      // Error handling is done by useWriteSQDTransaction
    }
  }, [poolId, writeTransactionAsync, queryClient]);

  if (!pool && !isLoading) return null;

  return (
    <Stack spacing={2}>
      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>{DELEGATE_TEXTS.currentBalance.label}</span>
            <HelpTooltip title={DELEGATE_TEXTS.currentBalance.tooltip(SQD_TOKEN)} />
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {isLoading ? <Skeleton width="50%" /> : tokenFormatter(balance, SQD_TOKEN, 2)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isLoading ? <Skeleton width="50%" /> : `~${dollarFormatter(balanceInUsd || 0)}`}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <ProvideButton poolId={poolId} />
            <WithdrawButton poolId={poolId} />
          </Stack>
        </Stack>
      </Card>

      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>{DELEGATE_TEXTS.availableRewards.label}</span>
            <HelpTooltip title={DELEGATE_TEXTS.availableRewards.tooltip} />
          </Stack>
        }
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {isLoading ? (
                <Skeleton width="50%" />
              ) : (
                tokenFormatter(rewards, pool?.rewardToken.symbol ?? '', 2)
              )}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isLoading ? (
                <Skeleton width="50%" />
              ) : (
                `${tokenFormatter(dailyRewardRate, pool?.rewardToken.symbol ?? '', 4)}${DELEGATE_TEXTS.rewardRateUnit}`
              )}
            </Typography>
          </Stack>
          <Tooltip title={pool ? getClaimRewardsTooltip(pool.phase, SQD_TOKEN) : ''}>
            <span>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleClaimRewards}
                disabled={!hasRewards || isPending || isLoading}
                loading={isPending}
              >
                CLAIM
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Card>
    </Stack>
  );
}

function getClaimRewardsTooltip(phase: PoolPhase, tokenSymbol: string): string {
  switch (phase) {
    case 'collecting':
      return DELEGATE_TEXTS.claimButtonTooltip;
    case 'idle':
      return DELEGATE_TEXTS.alerts.idle(tokenSymbol);
    case 'debt':
      return DELEGATE_TEXTS.alerts.debt;
    default:
      return '';
  }
}
