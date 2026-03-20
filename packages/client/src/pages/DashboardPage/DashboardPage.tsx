import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Chip, Stack, Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { NetworkSummary } from './Summary';

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'workers' || path === 'portal-pools' ? path : 'analytics';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/dashboard/${value}`, { replace: true });
  };

  return (
    <CenteredPageWrapper>
      <NetworkSummary />
      <Tabs value={activeTab} onChange={handleTabChange}>
      <Tab label="Analytics" value="analytics" />
        <Tab label="Workers" value="workers" />
        <Tab
          value="portal-pools"
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <span>Portal Pools</span>
              <Chip label="New" size="small" color="info" variant="outlined" />
            </Stack>
          }
        />
      </Tabs>
      <Outlet />
    </CenteredPageWrapper>
  );
}
