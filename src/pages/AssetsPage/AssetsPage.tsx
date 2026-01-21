import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';

import { MyAssets } from './Assets';

export function AssetsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'temporary-holdings' ? 'temporary-holdings' : 'vestings';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/assets/${value}`, { replace: true });
  };

  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyAssets />
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Vesting Contracts" value="vestings" />
          <Tab label="Temporary Holdings" value="temporary-holdings" />
        </Tabs>
        <Outlet />
      </ConnectedWalletRequired>
    </CenteredPageWrapper>
  );
}
