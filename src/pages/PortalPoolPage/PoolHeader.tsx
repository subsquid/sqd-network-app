import { Box, Chip, Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';

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
  const { data: pool, isLoading } = usePoolData(poolId);

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
              {isLoading ? (
                <Skeleton variant="circular" width={64} height={64} />
              ) : (
                <Avatar name={pool?.name ?? ''} colorDiscriminator={pool?.id ?? ''} size={64} />
              )}
              <Stack direction="column" alignItems="start" spacing={1}>
                <Typography variant="h5">
                  {isLoading ? <Skeleton width="50%" /> : pool?.name}
                </Typography>
                {isLoading ? (
                  <Skeleton variant="rounded" width={80} height={24} />
                ) : pool ? (
                  <Tooltip title={getPhaseTooltip(pool.phase)}>
                    <Chip
                      label={getPhaseLabel(pool.phase)}
                      color={getPhaseColor(pool.phase)}
                      size="small"
                    />
                  </Tooltip>
                ) : null}
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, maxWidth: { sm: 300 } }}>
              {isLoading ? (
                <Stack spacing={0.5}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rounded" width="100%" height={10} />
                </Stack>
              ) : (
                <PoolHealthBar poolId={poolId} />
              )}
            </Box>
          </Stack>
          {/* <PoolStats poolId={poolId} /> */}
        </Stack>
      </Card>
      <PoolStats poolId={poolId} />
    </Stack>
  );
}
