import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, Tab, Tabs } from '@mui/material';

import { CenteredPageWrapper } from '@layouts/NetworkLayout';

import { NetworkSummary } from './Summary';

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const getActiveTab = () => {
    if (path === 'analytics') return 'analytics';
    if (path === 'portals') return 'portals';
    return 'workers';
  };
  const activeTab = getActiveTab();

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/dashboard/${value}`, { replace: true });
  };

  return (
    <CenteredPageWrapper>
      <NetworkSummary />
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Workers" value="workers" />
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              Portals
              <Chip label="Beta" size="small" color="info" variant="outlined"/>
            </Box>
          }
          value="portals"
        />
        <Tab label="Analytics" value="analytics" />
      </Tabs>
      <Outlet />
    </CenteredPageWrapper>
  );
}
