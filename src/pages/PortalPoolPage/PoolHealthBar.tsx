import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

import { fromSqd } from '@lib/network';
import { useCountdown } from '@hooks/useCountdown';

import type { PoolData } from './usePoolData';
import { calculateBufferHealth } from './usePoolData';
import { HelpTooltip } from '@components/HelpTooltip';
import { dateFormat } from '@i18n';

interface PoolHealthBarProps {
  pool: PoolData;
}

function getHealthColor(percentage: number): 'success' | 'warning' | 'error' {
  if (percentage >= 120) return 'success';
  if (percentage >= 100) return 'warning';
  return 'error';
}

function getHealthLabel(percentage: number): string {
  if (percentage >= 120) return 'Healthy';
  if (percentage >= 100) return 'Low Buffer';
  return 'Critical';
}

function getHealthDescription(percentage: number): string {
  if (percentage >= 120) {
    return 'Pool buffer is healthy. Yields are being distributed normally.';
  }
  if (percentage >= 100) {
    return 'Pool buffer is running low. Consider adding liquidity.';
  }
  return 'Pool buffer is critical. Yields have stopped until more liquidity is added.';
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
          {progress.toFixed(0)}%
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
  const color = getHealthColor(healthPercent);
  const label = getHealthLabel(healthPercent);
  const description = getHealthDescription(healthPercent);

  // Cap the visual progress at 100% but show actual percentage in text
  const visualProgress = Math.min(healthPercent, 100);

  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>Pool Health</span>
            <HelpTooltip title={description} />
          </Stack>
        </Typography>
        <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
          {label} ({healthPercent.toFixed(0)}%)
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

export function PoolHealthBar({ pool }: PoolHealthBarProps) {
  // Show paused warning if yields are stopped
  // if (pool.phase === 'paused') {
  //   return (
  //     <Box >
  //       <Alert severity="error" icon={<Warning />} sx={{ mb: 2 }}>
  //         <Typography variant="body2" fontWeight="medium">
  //           Yields Stopped
  //         </Typography>
  //         <Typography variant="caption">
  //           Buffer dropped below minimum. Yields will resume when more liquidity is added.
  //         </Typography>
  //       </Alert>
  //       <BufferHealth pool={pool} />
  //     </Box>
  //   );
  // }

  // Show activation progress during deposit window
  if (pool.phase === 'deposit_window') {
    return <ActivationProgress pool={pool} />;
  }

  // Show buffer health when active
  return <BufferHealth pool={pool} />;
}
