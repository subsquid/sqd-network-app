import { Box, Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { Sensors } from '@mui/icons-material';

import { addressFormatter } from '@lib/formatters/formatters';
import type { PoolData, PoolPhase } from './usePoolData';
import { Card } from '@components/Card';
import { PoolHealthBar } from './PoolHealthBar';
import { PoolStats } from './PoolStats';
import { Avatar } from '@components/Avatar';

interface PoolHeaderProps {
  pool: PoolData;
}

function getPhaseColor(phase: PoolPhase): 'success' | 'warning' | 'error' | 'default' | 'info' {
  switch (phase) {
    case 'active':
      return 'success';
    case 'deposit_window':
      return 'info';
    case 'paused':
      return 'warning';
    default:
      return 'default';
  }
}

function getPhaseLabel(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Active';
    case 'deposit_window':
      return 'Collecting';
    case 'paused':
      return 'Paused';
    default:
      return phase;
  }
}

function getPhaseTooltip(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Pool is active and earning rewards. Distributing yields to liquidity providers.';
    case 'deposit_window':
      return "Accepting deposits to reach activation threshold. Pool will activate once the minimum liquidity is reached. If threshold isn't met, deposits can be fully withdrawn.";
    case 'paused':
      return 'Pool temporarily paused. Rewards have stopped due to insufficient buffer. Will resume once liquidity increases above minimum threshold.';
    default:
      return phase;
  }
}

export function PoolHeader({ pool }: PoolHeaderProps) {
  return (
    <Card>
      <Stack spacing={2} divider={<Divider />}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
          <Box flex={0.5}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar name={pool.name} colorDiscriminator={pool.id} size={64} />
              <Stack direction="column" alignItems="start" spacing={1}>
                <Typography variant="h5">{pool.name}</Typography>
                <Tooltip title={getPhaseTooltip(pool.phase)}>
                  <Chip
                    label={getPhaseLabel(pool.phase)}
                    color={getPhaseColor(pool.phase)}
                    size="small"
                  />
                </Tooltip>
              </Stack>
            </Stack>
          </Box>

          <Box flex={0.4}>
            <PoolHealthBar pool={pool} />
          </Box>
        </Stack>
        <PoolStats pool={pool} />
      </Stack>
    </Card>
  );
}
