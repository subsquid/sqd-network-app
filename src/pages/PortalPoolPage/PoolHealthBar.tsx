import { dateFormat } from '@i18n';
import { AccessTime, CheckCircle, Error, Warning } from '@mui/icons-material';
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';

import { useCountdown } from '@hooks/useCountdown';
import { percentFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

import type { PoolData } from './hooks';
import { usePoolData } from './hooks';

interface PoolHealthBarProps {
  poolId: string;
}

interface ProgressBarProps {
  label: React.ReactNode;
  value: number;
  color: 'success' | 'warning' | 'error' | 'info';
}

function ProgressBar({ label, value, color }: ProgressBarProps) {
  // Cap the visual progress at 100% but show actual percentage in text
  const visualProgress = Math.min(value, 100);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color={`${color}.main`}>
          {label}
        </Typography>
        <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
          {percentFormatter(value)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={visualProgress}
        color={color}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: 'action.hover',
        }}
      />
    </Box>
  );
}

function getCapacityStatus(
  pool: PoolData,
  usagePercent: number,
): {
  color: 'success' | 'warning' | 'error';
  icon: React.ReactElement;
  text: string;
  description: string;
} {
  // Color is based on pool phase/state, not percentage
  const isHealthy = pool.phase === 'active' || pool.phase === 'debt';
  const isCritical = pool.phase === 'idle';

  let color: 'success' | 'warning' | 'error';
  let icon: React.ReactElement;
  let text: string;
  let description: string;

  if (isCritical) {
    color = 'error';
    icon = <Error sx={{ fontSize: 18, color: 'error.main' }} />;
    text = 'Critical';
    description =
      'Pool has insufficient liquidity. Rewards are paused until deposits increase above the minimum threshold required for operations.';
  } else if (!isHealthy || usagePercent < 50) {
    color = 'warning';
    icon = <Warning sx={{ fontSize: 18, color: 'warning.main' }} />;
    text = 'Low';
    description =
      'Pool liquidity is below optimal levels. Additional deposits may be needed to maintain stable reward distribution.';
  } else {
    color = 'success';
    icon = <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />;
    text = 'Healthy';
    description =
      'Pool has sufficient liquidity. Rewards are being distributed normally to all delegators.';
  }

  return { color, icon, text, description };
}

// Shows activation progress during deposit window phase
function ActivationProgress({ pool }: { pool: PoolData }) {
  const current = fromSqd(pool.tvl.total).toNumber();
  const max = fromSqd(pool.tvl.max).toNumber();
  const progress = (current / max) * 100;
  const timeRemaining = useCountdown({ timestamp: pool.depositWindowEndsAt });

  const label = (
    <Tooltip title={dateFormat(pool.depositWindowEndsAt, 'dateTime')}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <AccessTime sx={{ fontSize: 16 }} />
        <span>{timeRemaining || 'Deposit Window'}</span>
      </Stack>
    </Tooltip>
  );

  return <ProgressBar label={label} value={progress} color="info" />;
}

// Shows capacity usage when pool is active
function CapacityUsage({ pool }: { pool: PoolData }) {
  const current = fromSqd(pool.tvl.total).toNumber();
  const max = fromSqd(pool.tvl.max).toNumber();
  const min = fromSqd(pool.tvl.min).toNumber();

  const real = Math.min(0, current - min);
  const total = max - min;
  const usagePercent = total === 0 ? 100 : (real / total) * 100;
  const status = getCapacityStatus(pool, usagePercent);

  const realUsagePercent = max === 0 ? 100 : (current / max) * 100;

  const label = (
    <Tooltip title={status.description} arrow>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {status.icon}
        <Typography variant="body2" color={`${status.color}.main`}>
          {status.text}
        </Typography>
      </Stack>
    </Tooltip>
  );

  return <ProgressBar label={label} value={realUsagePercent} color={status.color} />;
}

export function PoolHealthBar({ poolId }: PoolHealthBarProps) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;

  if (pool.phase === 'collecting') {
    return <ActivationProgress pool={pool} />;
  }

  return <CapacityUsage pool={pool} />;
}
