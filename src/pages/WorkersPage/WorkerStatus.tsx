import { useMemo } from 'react';

import { dateFormat } from '@i18n';
import { CircleRounded } from '@mui/icons-material';
import { Box, Chip as MaterialChip, Tooltip, chipClasses, styled } from '@mui/material';
import capitalize from 'lodash-es/capitalize';

import { WorkerStatus as Status, useCurrentEpoch } from '@api/subsquid-network-squid';
import { useCountdown } from '@hooks/useCountdown';

export type WorkerStatusLabel =
  | 'online'
  | 'offline'
  | 'jailed'
  | 'registering'
  | 'deregistering'
  | 'deregistered';

export function getWorkerStatus(worker?: {
  status?: string;
  jailReason?: string;
  jailed?: boolean;
  online?: boolean;
}): {
  label: WorkerStatusLabel | string;
  color: 'error' | 'warning' | 'success' | 'primary';
  tip?: string;
} {
  if (!worker) return { label: 'unknown', color: 'primary' };

  switch (worker.status) {
    case Status.Active:
      if (worker.jailed) {
        return { label: 'jailed', color: 'warning', tip: worker.jailReason || 'Unknown' };
      } else if (!worker.online) {
        return { label: 'offline', color: 'error' };
      }
      return { label: 'online', color: 'success' };
    case Status.Registering:
      return { label: 'registering', color: 'primary' };
    case Status.Deregistering:
      return { label: 'deregistering', color: 'primary' };
    case Status.Deregistered:
      return { label: 'deregistered', color: 'primary' };
  }

  return { label: capitalize(worker.status), color: 'primary' };
}

export const Chip = styled(MaterialChip)(({ theme }) => ({
  // [`&.${chipClasses.colorSuccess}`]: {
  //   background: theme.palette.success.background,
  //   color: theme.palette.success.main,
  // },
  // [`&.${chipClasses.colorError}`]: {
  //   background: theme.palette.error.background,
  //   color: theme.palette.error.main,
  // },
  [`&.${chipClasses.colorPrimary}`]: {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.contrastText,
  },
}));

function AppliesTooltip({ timestamp }: { timestamp?: number }) {
  const timeLeft = useCountdown({ timestamp });

  return `Applies in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`;
}

export function WorkerStatusChip({
  status,
  worker,
}: {
  status?: WorkerStatusLabel | string;
  worker?: {
    status?: string;
    jailReason?: string;
    jailed?: boolean;
    online?: boolean;
    statusHistory?: {
      blockNumber: number;
      pending: boolean;
    }[];
  };
}) {
  const { label, color, tip } = useMemo((): {
    label: string;
    color: 'error' | 'warning' | 'success' | 'primary';
    tip?: string;
  } => {
    // If status string is provided directly, use it
    if (status) {
      switch (status) {
        case 'online':
          return { label: 'Online', color: 'success' };
        case 'offline':
          return { label: 'Offline', color: 'error' };
        case 'jailed':
          return { label: 'Jailed', color: 'warning' };
        case 'registering':
          return { label: 'Registering', color: 'primary' };
        case 'deregistering':
          return { label: 'Deregistering', color: 'primary' };
        case 'deregistered':
          return { label: 'Deregistered', color: 'primary' };
        default:
          return { label: capitalize(status), color: 'primary' };
      }
    }

    // Otherwise extract from worker object (backwards compatibility)
    const statusInfo = getWorkerStatus(worker);
    return {
      label: capitalize(statusInfo.label),
      color: statusInfo.color,
      tip: statusInfo.tip,
    };
  }, [status, worker]);

  const { data: currentEpoch } = useCurrentEpoch();
  const applyTimestamp = useMemo(() => {
    if (!currentEpoch || !worker?.statusHistory?.length) return;

    const lastStatus = worker.statusHistory[worker.statusHistory.length - 1];
    if (!lastStatus.pending) return;

    return (
      new Date(currentEpoch.lastBlockTimestampL1).getTime() +
      (lastStatus.blockNumber - currentEpoch.lastBlockL1 + 1) * currentEpoch.blockTimeL1
    );
  }, [currentEpoch, worker]);

  const chip = (
    <Tooltip
      title={applyTimestamp ? <AppliesTooltip timestamp={applyTimestamp} /> : undefined}
      placement="top"
    >
      <Chip
        color={color}
        label={label}
        variant="outlined"
        icon={
          <Box display="flex" justifyContent="center">
            <CircleRounded sx={{ fontSize: 7 }} />
          </Box>
        }
      />
    </Tooltip>
  );

  return tip ? (
    <Tooltip title={tip} placement="top">
      {chip}
    </Tooltip>
  ) : (
    chip
  );
}
