import { Stack, Typography, useTheme } from '@mui/material';

import type { WorkerDetailed } from '@api/subsquid-network-squid';
import { CopyToClipboard } from '@components/CopyToClipboard';

import { WorkerEdit } from './WorkerEdit';

export function WorkerTitle({
  worker,
  owner,
  canEdit,
}: {
  worker: Pick<WorkerDetailed, 'id' | 'status' | 'peerId' | 'name' | 'description' | 'website' | 'email'>;
  owner: { id: string; type: string };
  canEdit: boolean;
}) {
  const theme = useTheme();

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
          {worker.name || worker.peerId}
        </Typography>
        {canEdit ? <WorkerEdit worker={worker} owner={owner} disabled={!canEdit} /> : null}
      </Stack>
      <Typography
        variant="body2"
        component="span"
        sx={{ overflowWrap: 'anywhere', color: theme.palette.text.secondary }}
      >
        <CopyToClipboard text={worker.peerId} content={<span>{worker.peerId}</span>} />
      </Typography>
    </Stack>
  );
}
