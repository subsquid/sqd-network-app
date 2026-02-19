import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { NetworkSummary } from './Summary';

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'analytics' ? 'analytics' : 'workers';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/dashboard/${value}`, { replace: true });
  };

  return (
    <CenteredPageWrapper>
      <NetworkSummary />
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Workers" value="workers" />
        <Tab label="Analytics" value="analytics" />
      </Tabs>
      <Outlet />
    </CenteredPageWrapper>
  );
}
