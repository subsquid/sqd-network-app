import { useCallback, useMemo, useState } from 'react';

import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { Box, Chip, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { useAccount } from '@hooks/network/useAccount';

import { usePoolData } from './hooks';
import { PendingWithdrawals } from './PendingWithdrawals';
import { PoolHeader } from './PoolHeader';
import { PoolYieldChart } from './PoolYieldChart';
import { DelegateTab } from './tabs/DelegateTab';
import { InfoTab } from './tabs/InfoTab';
import { ManageTab } from './tabs/ManageTab';
import { PAGE_TEXTS } from './texts';

function PoolInfoCard({ poolId }: { poolId: string }) {
  const { data: pool } = usePoolData(poolId);
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState(0);

  const isOperator = useMemo(
    () => pool && address?.toLowerCase() === pool.operator.address.toLowerCase(),
    [pool, address],
  );

  const handleTabChange = useCallback((_: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
  }, []);

  return (
    <Stack spacing={2}>
      {isOperator && (
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={PAGE_TEXTS.tabs.general} value={0} />
          <Tab label={PAGE_TEXTS.tabs.manage} value={1} />
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
    return <NotFound item={PAGE_TEXTS.notFoundItem} id={poolId} />;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <PoolHeader poolId={poolId} />
          </Grid>
          <Grid size={12} sx={{ display: { xs: 'none', md: 'block' } }}>
            <PoolYieldChart poolId={poolId} />
          </Grid>
          <Grid size={12}>
            <PendingWithdrawals poolId={poolId} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PoolInfoCard poolId={poolId} />
      </Grid>
    </Grid>
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
            {PAGE_TEXTS.title}
            <Chip label={PAGE_TEXTS.betaLabel} size="small" color="info" variant="outlined" />
          </Box>
        }
      />
      <PoolPageContent poolId={poolId} />
    </CenteredPageWrapper>
  );
}
