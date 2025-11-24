import { Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useWorkerByPeerId } from '@api/subsquid-network-squid';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';

export const Worker = ({ backPath }: { backPath: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'general' ? 'general' : 'analytics';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/worker/${peerId}/${value}`);
  };

  const { peerId } = useParams<{ peerId: string }>();
  const { data: worker, isLoading: isLoading } = useWorkerByPeerId(peerId);

  if (isLoading) {
    return <Loader />;
  }

  if (!worker || !peerId) {
    return <NotFound item="worker" id={peerId} />;
  }

  return (
    <CenteredPageWrapper>
      <PageTitle title={'Worker'} />

      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="General" value="general" />
        <Tab label="Analytics" value="analytics" />
      </Tabs>
      <Outlet />
    </CenteredPageWrapper>
  );
};
