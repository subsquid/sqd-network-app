import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Grid, Stack, Tab, Tabs } from '@mui/material';

import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
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
    <Stack spacing={2} height="100%">
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="Delegate" />
        <Tab label="Info" />
        {isOperator && <Tab label="Manage" />}
      </Tabs>

      <Box height={462}>
        {activeTab === 0 && <DelegateTab poolId={poolId} />}
        {activeTab === 1 && <InfoTab poolId={poolId} />}
        {activeTab === 2 && isOperator && <ManageTab poolId={poolId} />}
      </Box>
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
    <Stack spacing={2}>
      <Grid container spacing={2} height={524} overflow={'auto'}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Box flex={1}>
              <PoolHeader poolId={poolId} />
            </Box>
            <Box>
              <PoolYieldChart poolId={poolId} />
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PoolInfoCard poolId={poolId} />
        </Grid>
      </Grid>

      <PendingWithdrawals poolId={poolId} />
    </Stack>
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
