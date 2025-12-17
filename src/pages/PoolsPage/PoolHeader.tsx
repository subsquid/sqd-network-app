import { Avatar, Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { Sensors } from '@mui/icons-material';

import { addressFormatter } from '@lib/formatters/formatters';
import type { PoolData, PoolPhase } from './usePoolData';
import { Card } from '@components/Card';
import { PoolHealthBar } from './PoolHealthBar';
import { PoolStats } from './PoolStats';

interface PoolHeaderProps {
  pool: PoolData;
}

function getPhaseColor(phase: PoolPhase): 'success' | 'warning' | 'error' | 'default' {
  switch (phase) {
    case 'active':
      return 'success';
    case 'deposit_window':
      return 'warning';
    case 'paused':
      return 'error';
    default:
      return 'default';
  }
}

function getPhaseLabel(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Active';
    case 'deposit_window':
      return 'Deposit Window';
    case 'paused':
      return 'Paused';
    default:
      return phase;
  }
}

export function PoolHeader({ pool }: PoolHeaderProps) {
  return (
    <Card>
      <Stack spacing={2} divider={<Divider />}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
              <Sensors />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h4">{pool.name}</Typography>
                <Chip
                  label={getPhaseLabel(pool.phase)}
                  color={getPhaseColor(pool.phase)}
                  size="small"
                />
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
