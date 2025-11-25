import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';

import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ConnectedWalletRequired } from '@network/ConnectedWalletRequired';

import { MyAssets } from './Assets';

export function AssetsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'temporary-holdings' ? 'temporary-holdings' : 'vestings';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/assets/${value}`);
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
