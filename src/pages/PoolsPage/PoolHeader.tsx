import { Avatar, Box, Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { Sensors } from '@mui/icons-material';

import { addressFormatter } from '@lib/formatters/formatters';
import type { PoolData, PoolPhase } from './usePoolData';
import { Card } from '@components/Card';
import { PoolHealthBar } from './PoolHealthBar';
import { PoolStats } from './PoolStats';

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
      return 'Pool is active and earning rewards. The portal is operational and distributing yields to liquidity providers.';
    case 'deposit_window':
      return "Accepting deposits to reach activation threshold. Portal will activate once the minimum liquidity is reached. If threshold isn't met, deposits can be fully withdrawn.";
    case 'paused':
      return 'Portal temporarily paused. Rewards have stopped due to insufficient buffer. Pool will resume once liquidity increases above minimum threshold.';
    default:
      return phase;
  }
}

export function PoolHeader({ pool }: PoolHeaderProps) {
  return (
    <Card>
      <Stack spacing={2} divider={<Divider />}>
        <Stack direction="row" alignItems="center" spacing={12} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              <Sensors />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h4">{pool.name}</Typography>
                <Tooltip title={getPhaseTooltip(pool.phase)}>
                  <Chip
                    label={getPhaseLabel(pool.phase)}
                    color={getPhaseColor(pool.phase)}
                    size="small"
                  />
                </Tooltip>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {addressFormatter(pool.operator.address, false)}
              </Typography>
            </Box>
          </Stack>

          <PoolHealthBar pool={pool} />
        </Stack>

        <PoolStats pool={pool} />
      </Stack>
    </Card>
  );
}
