import { Box, Divider, Stack, Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  useMySources,
  useMyWorkerDelegations,
  useWorkerByPeerId,
  WorkerStatus,
  WorkerStatus as ApiWorkerStatus,
} from '@api/subsquid-network-squid';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';
import { useMemo } from 'react';
import { isOwned } from '@lib/network';
import { Card } from '@components/Card';
import { Avatar } from '@components/Avatar';
import { WorkerTitle } from './WorkerTitle';
import {
  WorkerDelegate,
  WorkerStatusChip,
  WorkerUndelegate,
  WorkerUnregisterButton,
  WorkerVersion,
  WorkerWithdrawButton,
} from '@components/Worker';
import { Property, PropertyList } from '@components/Property';

export const Worker = ({ backPath }: { backPath: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  const path = location.pathname.split('/').pop() || '';
  const activeTab = path === 'general' ? 'general' : 'analytics';

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`/worker/${peerId}/${value}`, { replace: true });
  };

  const { peerId } = useParams<{ peerId: string }>();

  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);
  const { address } = useAccount();
  const { SQD_TOKEN } = useContracts();

  const { data: sources, isLoading: isSourcesLoading } = useMySources();
  const { data: delegations, isLoading: isDelegationsLoading } = useMyWorkerDelegations({ peerId });

  const isLoading = isPending || isSourcesLoading || isDelegationsLoading;

  const canEdit = useMemo(() => {
    if (!worker) return false;
    if (worker.status === ApiWorkerStatus.Withdrawn) return false;
    if (!isOwned(worker, address)) return false;
    return [ApiWorkerStatus.Active, ApiWorkerStatus.Registering].includes(worker.status);
  }, [worker, address]);

  if (isLoading) {
    return <Loader />;
  }

  if (!worker || !peerId) {
    return <NotFound item="worker" id={peerId} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!worker || !peerId) {
    return <NotFound item="worker" id={peerId} />;
  }

  return (
    <CenteredPageWrapper>
      <PageTitle title={'Worker'} />
      <Card
        title={
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              variant="circular"
              name={worker.name || worker.peerId}
              colorDiscriminator={worker.peerId}
              size={56}
            />
            <WorkerTitle worker={worker} owner={worker.owner} canEdit={canEdit} />
          </Stack>
        }
        action={
          <Stack direction="row" spacing={1}>
            <WorkerDelegate
              worker={worker}
              variant="outlined"
              sources={sources}
              disabled={isLoading}
            />
            <WorkerUndelegate
              worker={worker}
              sources={delegations?.map(d => ({
                id: d.owner.id,
                type: d.owner.type,
                balance: d.deposit,
                locked: d.locked || false,
                lockEnd: d.lockEnd,
              }))}
              disabled={isLoading}
            />
          </Stack>
        }
      >
        <Stack spacing={2}>
          <Divider orientation="horizontal" flexItem />
          <PropertyList>
            <Property label="Status" value={<WorkerStatusChip worker={worker} />} />
            <Property label="Version" value={<WorkerVersion worker={worker} />} />
          </PropertyList>
          {isOwned(worker, address) && worker.status !== ApiWorkerStatus.Withdrawn ? (
            <>
              <Divider orientation="horizontal" flexItem />
              <Box display="flex" justifyContent="flex-end">
                {worker.status === WorkerStatus.Deregistered ||
                worker.status === WorkerStatus.Deregistering ? (
                  <WorkerWithdrawButton
                    worker={worker}
                    source={{
                      ...worker.owner,
                      locked: !!worker.locked,
                      lockEnd: worker.lockEnd,
                    }}
                    disabled={worker.status !== WorkerStatus.Deregistered}
                  />
                ) : (
                  <WorkerUnregisterButton
                    worker={worker}
                    source={worker.owner}
                    disabled={worker.status !== WorkerStatus.Active}
                  />
                )}
              </Box>
            </>
          ) : null}
        </Stack>
      </Card>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="General" value="general" />
        <Tab label="Analytics" value="analytics" />
      </Tabs>
      <Outlet />
    </CenteredPageWrapper>
  );
};
