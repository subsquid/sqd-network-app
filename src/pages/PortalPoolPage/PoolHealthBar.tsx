import { useMemo } from 'react';

import { dateFormat } from '@i18n';
import { AccessTime, Error, Warning } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography, alpha, useTheme } from '@mui/material';

import { useCountdown } from '@hooks/useCountdown';
import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { useContracts } from '@hooks/network/useContracts';

import type { PoolData } from './hooks';
import { usePoolData } from './hooks';
import { HEALTH_TEXTS } from './texts';

type PoolStatus = 'collecting' | 'critical' | 'low' | 'healthy';

const STATUS_CONFIG: Record<
  PoolStatus,
  { color: 'info' | 'error' | 'warning' | 'success'; description: string }
> = {
  collecting: {
    color: 'info',
    description: HEALTH_TEXTS.status.collecting,
  },
  critical: {
    color: 'error',
    description: HEALTH_TEXTS.bar.critical,
  },
  low: {
    color: 'warning',
    description: HEALTH_TEXTS.bar.warning,
  },
  healthy: {
    color: 'success',
    description: HEALTH_TEXTS.bar.healthy,
  },
};

function getPoolStatus(pool: PoolData): PoolStatus {
  if (pool.phase === 'collecting') return 'collecting';
  if (pool.phase === 'idle') return 'critical';
  if (pool.tvl.current.lt(pool.tvl.min)) return 'low';
  return 'healthy';
}

function ActivationCountdown({ pool }: { pool: PoolData }) {
  const timeRemaining = useCountdown({ timestamp: pool.depositWindowEndsAt });

  return (
    <Tooltip title={dateFormat(pool.depositWindowEndsAt, 'dateTime')}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ color: `${STATUS_CONFIG.collecting.color}.main` }}
      >
        <AccessTime sx={{ fontSize: 16 }} />
        <span>{timeRemaining || HEALTH_TEXTS.bar.provisionWindowLabel}</span>
      </Stack>
    </Tooltip>
  );
}

function StatusIcon({ status }: { status: PoolStatus }) {
  const { description } = STATUS_CONFIG[status];

  switch (status) {
    case 'collecting':
      return null;
    case 'critical':
      return (
        <Tooltip title={description} arrow>
          <Error sx={{ fontSize: '1.25rem', color: 'error.main' }} />
        </Tooltip>
      );
    case 'low':
      return (
        <Tooltip title={description} arrow>
          <Warning sx={{ fontSize: '1.25rem', color: 'warning.main' }} />
        </Tooltip>
      );
    case 'healthy':
      return null;
  }
}

function ProgressBar({ pool }: { pool: PoolData }) {
  const theme = useTheme();
  const { SQD_TOKEN } = useContracts();

  const status = useMemo(() => getPoolStatus(pool), [pool]);
  const { color } = STATUS_CONFIG[status];

  const { tvl } = pool;

  const progress = useMemo(
    () => ({
      main: Math.min(tvl.current.div(tvl.max).times(100).toNumber(), 100),
      buffer: Math.min(tvl.total.div(tvl.max).times(100).toNumber(), 100),
      threshold: Math.min(tvl.min.div(tvl.max).times(100).toNumber(), 100),
    }),
    [tvl.current, tvl.total, tvl.max, tvl.min],
  );

  const showBuffer = progress.main < progress.buffer;
  const showThreshold = progress.threshold > 0 && status !== 'collecting';

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" fontWeight="medium">
          <Box display="flex">
            {status === 'collecting' ? (
              <ActivationCountdown pool={pool} />
            ) : (
              <StatusIcon status={status} />
            )}
          </Box>
        </Typography>
        <Stack direction="row" spacing={1}>
          {showBuffer && (
            <Typography variant="body2" fontWeight="medium">
              {HEALTH_TEXTS.bar.stable.label}: {percentFormatter(progress.main)}
            </Typography>
          )}
          <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
            {HEALTH_TEXTS.bar.total.label}: {percentFormatter(progress.buffer)}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            height: 10,
            borderRadius: 1,
            backgroundColor: 'action.hover',
            overflow: 'hidden',
          }}
        >
          <Tooltip title={HEALTH_TEXTS.bar.stable.tooltip(tokenFormatter(tvl.current, SQD_TOKEN))}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress.main}%`,
                backgroundColor: theme.palette[color].main,
              }}
            />
          </Tooltip>
          <Tooltip
            title={HEALTH_TEXTS.bar.pendingWithdrawals.tooltip(
              tokenFormatter(tvl.total.minus(tvl.current), SQD_TOKEN),
            )}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: `${progress.main}%`,
                height: '100%',
                width: `${progress.buffer - progress.main}%`,
                backgroundColor: alpha(theme.palette.warning.main, 0.5),
              }}
            />
          </Tooltip>
        </Box>

        {showThreshold && (
          <Tooltip
            title={HEALTH_TEXTS.bar.minimumThreshold.tooltip(tokenFormatter(tvl.min, SQD_TOKEN))}
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${progress.threshold}%`,
                top: -2,
                bottom: -2,
                width: 2,
                backgroundColor: theme.palette.text.disabled,
                zIndex: 1,
              }}
            />
          </Tooltip>
        )}
      </Box>
    </Stack>
  );
}

export function PoolHealthBar({ poolId }: { poolId: string }) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;

  return <ProgressBar pool={pool} />;
}
