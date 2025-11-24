import { SxProps } from '@mui/material';

import { Worker } from '@api/subsquid-network-squid';
import { NameWithAvatar } from '@components/SourceWalletName';
import { shortPeerId } from '@components/PeerId';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Link } from 'react-router-dom';

export const WorkerName = ({
  worker,
  loading,
  sx,
}: {
  sx?: SxProps;
  worker?: Pick<Worker, 'name' | 'peerId'>;
  loading?: boolean;
}) => {
  if (!worker && !loading) return null;

  return (
    <NameWithAvatar
      title={worker?.name || 'Worker'}
      subtitle={
        <CopyToClipboard
          text={worker?.peerId || ''}
          content={
            <Link to={`/worker/${worker?.peerId}`}>{shortPeerId(worker?.peerId || '')}</Link>
          }
        />
      }
      avatarValue={worker?.peerId}
      sx={sx}
    />
  );
};
