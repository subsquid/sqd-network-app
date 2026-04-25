import { LogoutOutlined } from '@mui/icons-material';
import { useDisconnect } from 'wagmi';

import { useAppReload } from '../..';
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
        await reload();
      }}
    />
  );
}
