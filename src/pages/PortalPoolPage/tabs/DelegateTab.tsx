import { useCallback, useMemo } from "react";
import { Button, Divider, Stack, Tooltip, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import { useQueryClient } from "@tanstack/react-query";

import { portalPoolAbi } from "@api/contracts";
import { useWriteSQDTransaction } from "@api/contracts/useWriteTransaction";
import { useTokenPrice } from "@api/price";
import { Card } from "@components/Card";
import { HelpTooltip } from "@components/HelpTooltip";
import { useRewardToken } from "@hooks/useRewardToken";
import { dollarFormatter, tokenFormatter } from "@lib/formatters/formatters";
import { fromSqd } from "@lib/network";
import { useContracts } from "@network/useContracts";

import { ProvideButton } from "../dialogs/ProvideDialog";
import { WithdrawButton } from "../dialogs/WithdrawDialog";
import { usePoolData, usePoolUserData, type PoolPhase } from "../hooks";
import { invalidatePoolQueries } from "../utils/poolUtils";

interface DelegateTabProps {
  poolId: string;
}

export function DelegateTab({ poolId }: DelegateTabProps) {
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const { data: rewardToken } = useRewardToken();
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const balance = userData ? fromSqd(userData.userBalance) : BigNumber(0);
  const balanceInUsd = sqdPrice ? balance.toNumber() * sqdPrice : undefined;

  const rewards = userData
    ? new BigNumber(userData.userRewards.toString()).div(
        10 ** (rewardToken?.decimals ?? 6),
      )
    : BigNumber(0);

  const dailyRewardRate = useMemo(() => {
    if (!pool || !userData || !pool.tvl.current || pool.phase !== "active")
      return BigNumber(0);

    // Calculate daily distribution rate: rate per second * seconds in a day / decimals
    const dailyDistribution = new BigNumber(
      pool.distributionRatePerSecond.toString(),
    )
      .multipliedBy(86400)
      .div(10 ** (rewardToken?.decimals ?? 6));

    // Calculate user's share of daily rewards: daily rate * (user balance / total active stake)
    const userShare = balance.div(fromSqd(pool.tvl.current));

    return dailyDistribution.multipliedBy(userShare);
  }, [pool, userData, balance, rewardToken?.decimals]);

  const hasRewards = userData ? userData.userRewards > BigInt(0) : false;

  const handleClaimRewards = useCallback(async () => {
    try {
      await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName: "claimRewards",
        args: [],
      });
      await invalidatePoolQueries(queryClient, poolId);
    } catch (error) {
      // Error handling is done by useWriteSQDTransaction
    }
  }, [poolId, writeTransactionAsync, queryClient]);

  return (
    <Stack spacing={2} height="100%">
      <Card
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>Current Balance</span>
            <HelpTooltip title="Your deposited SQD tokens in this pool." />
          </Stack>
        }
        sx={{ height: "100%" }}
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {tokenFormatter(balance, SQD_TOKEN, 2)}
            </Typography>
            <Typography variant="body1">
              ≈ {dollarFormatter(balanceInUsd || 0)}
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
            <span>Available Rewards</span>
            <HelpTooltip title="Accumulated rewards ready to claim." />
          </Stack>
        }
        sx={{ height: "100%" }}
      >
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h5">
              {tokenFormatter(rewards, rewardToken?.symbol ?? "USDC", 2)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tokenFormatter(dailyRewardRate, rewardToken?.symbol ?? "", 4)}
              /day
            </Typography>
          </Stack>
          <Tooltip title={getClaimRewardsTooltip(pool!.phase)}>
            <span>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleClaimRewards}
                disabled={!hasRewards || isPending}
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

function getClaimRewardsTooltip(phase: PoolPhase): string {
  switch (phase) {
    case "collecting":
      return "The reward distribution will start once the pool is active";
    case "idle":
      return "The reward distribution is paused because there is insufficient SQD locked in the pool";
    case "debt":
      return "The reward distribution is paused because the pool is out of rewards";
    default:
      return "";
  }
}
