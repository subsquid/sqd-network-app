import { LogoutOutlined } from '@mui/icons-material';

import { useAppReload } from '../../index.tsx';
import { BasicMenuItem } from './BasicMenuItem';

export function LogoutMenuItem() {
  const reload = useAppReload({ to: '/' });

  return <BasicMenuItem LeftIcon={LogoutOutlined} label="Disconnect" onClick={() => reload()} />;
}
