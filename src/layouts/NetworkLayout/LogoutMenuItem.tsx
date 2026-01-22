import { LogoutOutlined } from '@mui/icons-material';

import { BasicMenuItem } from './BasicMenuItem';
import { useDisconnect } from 'wagmi';
import { useAppReload } from '../..';

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
