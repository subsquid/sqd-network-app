import { Box, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';

import { Avatar } from '@components/Avatar';
import { Card } from '@components/Card';

import { usePoolData } from './hooks';
import { PoolHealthBar } from './PoolHealthBar';
import { PoolStats } from './PoolStats';
import { getPhaseColor, getPhaseLabel, getPhaseTooltip } from './utils/poolUtils';

interface PoolHeaderProps {
  poolId: string;
}

export function PoolHeader({ poolId }: PoolHeaderProps) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;
  return (
    <Stack spacing={2}>
      <Card>
        <Stack spacing={2} divider={<Divider />}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
            justifyContent="space-between"
          >
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

            <Box sx={{ flex: 1, maxWidth: { sm: 300 } }}>
              <PoolHealthBar poolId={poolId} />
            </Box>
          </Stack>
          {/* <PoolStats poolId={poolId} /> */}
        </Stack>
      </Card>
      <PoolStats poolId={poolId} />
    </Stack>
  );
}
