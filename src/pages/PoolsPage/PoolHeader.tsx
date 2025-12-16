import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { Sensors } from '@mui/icons-material';

import { addressFormatter } from '@lib/formatters/formatters';
import type { PoolData, PoolPhase } from './usePoolData';

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
      return 'Paused - Yields Stopped';
    default:
      return phase;
  }
}

export function PoolHeader({ pool }: PoolHeaderProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
          <Sensors />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" component="h1">
              {pool.name}
            </Typography>
            <Chip
              label={getPhaseLabel(pool.phase)}
              color={getPhaseColor(pool.phase)}
              size="small"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Operated by {pool.operator.name} {addressFormatter(pool.operator.address, true)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
