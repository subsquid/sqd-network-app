import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

import { Card } from '@components/Card';
import { Property, PropertyList } from '@components/Property';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { fromSqd } from '@lib/network';

import { PoolHeader } from './PoolHeader';
import { PoolYieldChart } from './PoolYieldChart';
import { PendingWithdrawals } from './PendingWithdrawals';
import { DelegateTab } from './DelegateTab';
import { usePoolData, usePoolUserData, usePoolPendingWithdrawals, type PoolData, type PoolUserData, type PendingWithdrawal } from './usePoolData';
import { dateFormat } from '@i18n';
import { addressFormatter, urlFormatter } from '@lib/formatters/formatters';

function PoolInfoCard({ pool, userData, pendingWithdrawals }: { pool: PoolData; userData?: PoolUserData; pendingWithdrawals?: PendingWithdrawal[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="Delegate" />
        <Tab label="Manage" disabled />
        <Tab label="Info" />
      </Tabs>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        justifyContent="stretch"
        sx={{ height: '100%' }}
      >
        {activeTab === 0 && <DelegateTab pool={pool} userData={userData} pendingWithdrawals={pendingWithdrawals} />}
        {activeTab === 1 && (
          <>
            <Card sx={{ height: '100%' }}>
              <Stack spacing={2} divider={<Divider />}></Stack>
            </Card>
          </>
        )}
        {activeTab === 2 && (
          <Card sx={{ height: '100%' }}>
            <Stack divider={<Divider />} spacing={2} sx={{}}>
              <PropertyList>
                <Property label="Contract" value={addressFormatter(pool.id, true)} />
                <Property label="Operator" value={addressFormatter(pool.operator.address, true)} />
                <Property
                  label="Created"
                  value={dateFormat(new Date('2025-12-16T12:00:00Z'), 'dateTime')}
                />
                <Property
                  label="Website"
                  value={
                    pool.website && (
                      <a href={urlFormatter(pool.website)} target="_blank" rel="noreferrer">
                        {pool.website}
                      </a>
                    )
                  }
                />
              </PropertyList>
              <Typography>{pool.description}</Typography>
            </Stack>
          </Card>
        )}
      </Box>
    </>
  );
}

function PoolPageContent({ poolId }: { poolId?: string }) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);
  const { data: pendingWithdrawals } = usePoolPendingWithdrawals(poolId);

  if (poolLoading) {
    return <Box>Loading...</Box>;
  }

  if (!pool) {
    return <Box>Pool not found</Box>;
  }

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }} container>
            <Grid size={{ xs: 12 }}>
              <PoolHeader pool={pool} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <PoolYieldChart
                monthlyPayoutUsd={pool.monthlyPayoutUsd}
                tvlInSqd={fromSqd(pool.tvl.max).toNumber()}
              />
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} height="100%">
              <PoolInfoCard pool={pool} userData={userData} pendingWithdrawals={pendingWithdrawals} />
            </Stack>
          </Grid>
        </Grid>

        <PendingWithdrawals pool={pool} userData={userData} pendingWithdrawals={pendingWithdrawals || []} />
      </Box>
    </>
  );
}

export function PoolPage() {
  const { poolId } = useParams<{ poolId: string }>();

  return (
    <CenteredPageWrapper>
      <PoolPageContent poolId={poolId} />
    </CenteredPageWrapper>
  );
}
