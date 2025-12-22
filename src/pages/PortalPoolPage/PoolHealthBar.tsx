import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { AccessTime, CheckCircle, Warning, Error } from '@mui/icons-material';

import { useCountdown } from '@hooks/useCountdown';
import { dateFormat } from '@i18n';
import { percentFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

import type { PoolData } from './hooks';
import { usePoolData } from './hooks';

interface PoolHealthBarProps {
  poolId: string;
}

function calculateBufferHealth(pool: PoolData): number {
  const current = fromSqd(pool.tvl.current).toNumber();
  const max = fromSqd(pool.tvl.max).toNumber();
  if (max === 0) return 100;
  return (current / max) * 100;
}

function getHealthColor(state: 'healthy' | 'low' | 'critical'): 'success' | 'warning' | 'error' {
  if (state === 'healthy') return 'success';
  if (state === 'low') return 'warning';
  return 'error';
}

function getPoolState(pool: PoolData): 'healthy' | 'low' | 'critical' {
  const max = fromSqd(pool.tvl.max).toNumber();
  const min = fromSqd(pool.tvl.min).toNumber();
  const current = fromSqd(pool.tvl.current).toNumber();

  const buffer = current - min;

  if (current < min) return 'critical';
  if (current < min + buffer / 2) return 'low';

  return 'healthy';
}

function getHealthLabel(pool: PoolData): React.ReactNode {
  const poolState = getPoolState(pool);
  const description = getHealthDescription(poolState);

  if (poolState === 'healthy')
    return (
      <Tooltip title={description} arrow>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
          <Typography variant="body2" color="success.main">
            Healthy
          </Typography>
        </Stack>
      </Tooltip>
    );
  if (poolState === 'low')
    return (
      <Tooltip title={description} arrow>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Warning sx={{ fontSize: 18, color: 'warning.main' }} />
          <Typography variant="body2" color="warning.main">
            Low
          </Typography>
        </Stack>
      </Tooltip>
    );
  return (
    <Tooltip title={description} arrow>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Error sx={{ fontSize: 18, color: 'error.main' }} />
        <Typography variant="body2" color="error.main">
          Critical
        </Typography>
      </Stack>
    </Tooltip>
  );
}

function getHealthDescription(state: 'healthy' | 'low' | 'critical'): string {
  if (state === 'healthy') {
    return 'Pool buffer is healthy. Yields are being distributed normally.';
  }
  if (state === 'low') {
    return 'Pool is running low. Consider adding liquidity.';
  }
  return 'Pool is critical. Yields have stopped until more liquidity is added.';
}

// Shows activation progress during deposit window phase
function ActivationProgress({ pool }: { pool: PoolData }) {
  const current = fromSqd(pool.tvl.current).toNumber();
  const threshold = fromSqd(pool.activation.threshold).toNumber();
  const progress = Math.min((current / threshold) * 100, 100);

  const timeRemaining = useCountdown({ timestamp: pool.depositWindowEndsAt });

  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <Tooltip title={dateFormat(pool.depositWindowEndsAt, 'dateTime')}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTime sx={{ fontSize: 16 }} />
              <span>{timeRemaining || 'Deposit Window'}</span>
            </Stack>
          </Tooltip>
        </Typography>
        <Typography variant="body2" color="info.main" fontWeight="medium">
          {percentFormatter(progress)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        color="info"
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: '#f0f2f5',
        }}
      />
    </Box>
  );
}

// Shows buffer health when pool is active
function BufferHealth({ pool }: { pool: PoolData }) {
  const healthPercent = calculateBufferHealth(pool);
  const color = getHealthColor(getPoolState(pool));
  const label = getHealthLabel(pool);

  // Cap the visual progress at 100% but show actual percentage in text
  const visualProgress = Math.min(healthPercent, 100);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color={`${color}.main`}>
          {label}
        </Typography>
        <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
          {percentFormatter(healthPercent)}
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

export function PoolHealthBar({ poolId }: PoolHealthBarProps) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;

  if (pool.phase === 'collecting') {
    return <ActivationProgress pool={pool} />;
  }

  return <BufferHealth pool={pool} />;
}
