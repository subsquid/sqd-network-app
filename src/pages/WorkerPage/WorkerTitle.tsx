import { Account, type Worker as ApiWorker } from '@api/subsquid-network-squid';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Stack, Typography, useTheme } from '@mui/material';
import { WorkerEdit } from './WorkerEdit';

export function WorkerTitle({
  worker,
  owner,
  canEdit,
}: {
  worker: Pick<ApiWorker, 'id' | 'status' | 'peerId' | 'name'>;
  owner: Pick<Account, 'id' | 'type'>;
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
