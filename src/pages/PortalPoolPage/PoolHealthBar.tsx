import { dateFormat } from '@i18n';
import { AccessTime, CheckCircle, Error, Warning } from '@mui/icons-material';
import { alpha, Box, LinearProgress, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import { useCountdown } from '@hooks/useCountdown';
import { percentFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

import type { PoolData } from './hooks';
import { usePoolData } from './hooks';

interface PoolHealthBarProps {
  poolId: string;
}

interface ProgressBarProps {
  label?: React.ReactNode;
  value: number;
  valueBuffer?: number;
  color: 'success' | 'warning' | 'error' | 'info';
  threshold?: number;
}

function ProgressBar({ label, value, valueBuffer, color, threshold }: ProgressBarProps) {
  const theme = useTheme();
  const visualProgress = Math.min(value, 100);
  const bufferProgress = Math.min(valueBuffer || 0, 100);
  const thresholdLine = Math.min(threshold || 0, 100);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color={`${color}.main`}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {visualProgress < bufferProgress && (
            <Typography variant="body2" fontWeight="medium">
              Stable: {percentFormatter(value)}
            </Typography>
          )}
          <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
            Total: {percentFormatter(valueBuffer)}
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <LinearProgress
          variant="buffer"
          value={visualProgress}
          valueBuffer={bufferProgress}
          color={color}
          sx={{
            height: 10,
            borderRadius: 1,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-dashed': {
              display: 'none',
            },
            '& .MuiLinearProgress-bar2': {
              backgroundColor: alpha(theme.palette[color].main, 0.5),
            },
          }}
        />
        {!!thresholdLine && (
          <Box
            sx={{
              position: 'absolute',
              left: `${thresholdLine}%`,
              top: -2,
              bottom: -2,
              width: 2,
              backgroundColor: theme.palette.text.disabled,
              zIndex: 1,
            }}
          />
        )}
      </Box>
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
  } else if (!isHealthy || usagePercent < 100) {
    color = 'warning';
    icon = <Warning sx={{ fontSize: 18, color: 'warning.main' }} />;
    text = 'Low';
    description =
      'Stable pool liquidity is below max level. Additional deposits may be needed to maintain stable reward distribution.';
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
  const current = fromSqd(pool.tvl.current);
  const total = fromSqd(pool.tvl.total);
  const max = fromSqd(pool.tvl.max);
  const min = fromSqd(pool.tvl.min);

  const usagePercent = current.div(max).times(100).toNumber();
  const totalUsagePercent = total.div(max).times(100).toNumber();
  const threshold = min.div(max).times(100).toNumber();
  const status = getCapacityStatus(pool, usagePercent);

  const label = status.color === 'success' ? null : (
    <Tooltip title={status.description} arrow>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {status.icon}
        {/* <Typography variant="body2" color={`${status.color}.main`}>
          {status.text}
        </Typography> */}
      </Stack>
    </Tooltip>
  );

  return (
    <ProgressBar
      label={label}
      value={usagePercent}
      valueBuffer={totalUsagePercent}
      color={status.color}
      threshold={threshold}
    />
  );
}

export function PoolHealthBar({ poolId }: PoolHealthBarProps) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;

  if (pool.phase === 'collecting') {
    return <ActivationProgress pool={pool} />;
  }

  return <CapacityUsage pool={pool} />;
}
