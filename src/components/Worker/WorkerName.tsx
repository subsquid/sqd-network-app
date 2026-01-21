import { SxProps } from '@mui/material';
import { Link } from 'react-router-dom';

import { Worker } from '@api/subsquid-network-squid';
import { shortPeerId } from '@components/PeerId';
import { NameWithAvatar } from '@components/SourceWalletName';

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
      subtitle={<Link to={`/worker/${worker?.peerId}`}>{shortPeerId(worker?.peerId || '')}</Link>}
      avatarValue={worker?.peerId}
      sx={sx}
    />
  );
};
