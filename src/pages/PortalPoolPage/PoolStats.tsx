import type { ReactNode } from "react";
import { Avatar, Box, Link, Stack, Typography } from "@mui/material";

import { useTokenPrice } from "@api/price";
import { HelpTooltip } from "@components/HelpTooltip";
import { useRewardToken } from "@hooks/useRewardToken";
import {
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from "@lib/formatters/formatters";
import { fromSqd } from "@lib/network";
import { useContracts } from "@network/useContracts";

import { usePoolData } from "./hooks";
import { USDC_LOGO_URL } from "./utils/constants";
import { calculateApy } from "./utils/poolUtils";

interface PoolStatsProps {
  poolId: string;
}

function StatItem({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  tooltip?: string;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" noWrap>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>{label}</span>
          {tooltip && <HelpTooltip title={tooltip} />}
        </Stack>
      </Typography>
      <Box sx={{ "& > *": { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
}

export function PoolStats({ poolId }: PoolStatsProps) {
  const { data: pool } = usePoolData(poolId);
  const { SQD_TOKEN, SQD } = useContracts();
  const { data: sqdPrice } = useTokenPrice({ address: SQD });
  const { address: rewardTokenAddress, data: rewardToken } = useRewardToken();

  if (!pool) return null;

  const currentTvl = fromSqd(pool.tvl.current);
  const maxTvl = fromSqd(pool.tvl.max);
  const tvlPercent = maxTvl.gt(0)
    ? currentTvl.div(maxTvl).times(100).toNumber()
    : 0;

  // APY = (Annual Rewards) / (Capacity in USD)
  // Since rewards are constant: Annual = Monthly × 12
  const calculatedApyRatio =
    calculateApy(pool.monthlyPayoutUsd, maxTvl.toNumber(), sqdPrice) || 0;
  const displayApy = calculatedApyRatio * 100;

  const apyTooltip =
    "APY = (Monthly Payout × 12) / (Max Pool Capacity × SQD Price)\nCalculated using current SQD price.";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <StatItem
        label="TVL"
        tooltip="Total Value Locked - current deposits relative to maximum pool capacity."
        value={
          <Stack
            direction="row"
            alignItems="baseline"
            spacing={0.5}
            flexWrap="wrap"
          >
            <Typography variant="h6" component="span">
              {numberCompactFormatter(currentTvl.toNumber())}
            </Typography>
            <Typography variant="h6" component="span">
              / {numberCompactFormatter(maxTvl.toNumber())} {SQD_TOKEN}
            </Typography>
          </Stack>
        }
      />
      <StatItem
        label="APY"
        tooltip={apyTooltip}
        value={
          <Typography variant="h6">{percentFormatter(displayApy)}</Typography>
        }
      />
      <StatItem
        label="Monthly Payout"
        value={
          <Typography variant="h6">
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              flexWrap="wrap"
            >
              <Typography variant="h6">
                {tokenFormatter(
                  pool.monthlyPayoutUsd,
                  rewardToken?.symbol ?? "USDC",
                  0,
                )}
              </Typography>
              {rewardTokenAddress && (
                <Link
                  href={`https://arbiscan.io/token/${rewardTokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    src={USDC_LOGO_URL}
                    alt={rewardToken?.symbol ?? "USDC"}
                    sx={{ width: 24, height: 24 }}
                  />
                </Link>
              )}
            </Stack>
          </Typography>
        }
        tooltip="Fixed monthly amount paid to SQD liquidity providers"
      />
    </Stack>
  );
}
