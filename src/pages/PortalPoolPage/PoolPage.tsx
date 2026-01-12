import { useState } from 'react';

import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { Box, Chip, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { useAccount } from '@network/useAccount';

import { usePoolData } from './hooks';
import { PendingWithdrawals } from './PendingWithdrawals';
import { PoolHeader } from './PoolHeader';
import { PoolYieldChart } from './PoolYieldChart';
import { DelegateTab } from './tabs/DelegateTab';
import { InfoTab } from './tabs/InfoTab';
import { ManageTab } from './tabs/ManageTab';

function PoolInfoCard({ poolId }: { poolId: string }) {
  const { data: pool } = usePoolData(poolId);
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState(0);

  const isOperator = pool && address?.toLowerCase() === pool.operator.address.toLowerCase();

  return (
    <Stack spacing={2}>
      {isOperator && (
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label="General" value={0} />
          <Tab label="Manage" value={1} />
        </Tabs>
      )}
      {activeTab === 0 && (
        <>
          <DelegateTab poolId={poolId} />
          <InfoTab poolId={poolId} />
        </>
      )}
      {activeTab === 1 && <ManageTab poolId={poolId} />}
    </Stack>
  );
}

function PoolPageContent({ poolId }: { poolId?: string }) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);

  if (poolLoading) {
    return <Loader />;
  }

  if (!pool || !poolId) {
    return <NotFound item="portal pool" id={poolId} />;
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <Box flex={0.7}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <PoolHeader poolId={poolId} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <PoolYieldChart poolId={poolId} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <PendingWithdrawals poolId={poolId} />
            </Grid>
          </Grid>
        </Box>
        <Box flex={0.3}>
          <PoolInfoCard poolId={poolId} />
        </Box>
      </Stack>
    </>
  );
}

export function PoolPage() {
  const { poolId } = useParams<{ poolId: string }>();
  return (
    <CenteredPageWrapper>
      <PageTitle
        backButton={false}
        title={
          <Box display="flex" alignItems="center" gap={1}>
            Portal Pool
            <Chip label="Beta" size="small" color="info" variant="outlined" />
          </Box>
        }
      />
      <PoolPageContent poolId={poolId} />
    </CenteredPageWrapper>
  );
}
