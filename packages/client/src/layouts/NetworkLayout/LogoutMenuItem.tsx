import { LogoutOutlined } from '@mui/icons-material';
import { useDisconnect } from 'wagmi';

import { useAppReload } from '../..';
import { clearMockAccountIndex, isMockMode } from '../../config';
import { BasicMenuItem } from './BasicMenuItem';

export function LogoutMenuItem() {
  const { disconnectAsync } = useDisconnect();
  const reload = useAppReload({});

  return (
    <BasicMenuItem
      LeftIcon={LogoutOutlined}
      label="Disconnect"
      onClick={async () => {
        await disconnectAsync();
        // Clear the stored mock account so the next connect starts fresh
        if (isMockMode) clearMockAccountIndex();
        await reload();
      }}
    />
  );
}
