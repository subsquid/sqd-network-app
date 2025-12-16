import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

import { Card } from '@components/Card';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { fromSqd } from '@lib/network';

import { PoolHeader } from './PoolHeader';
import { PoolStats } from './PoolStats';
import { PoolHealthBar } from './PoolHealthBar';
import { PoolYieldChart } from './PoolYieldChart';
import { UserPoolBalance } from './UserPoolBalance';
import { ProvideButton } from './ProvideDialog';
import { WithdrawButton } from './WithdrawDialog';
import { PendingWithdrawals } from './PendingWithdrawals';
import { usePoolData, type PoolData } from './usePoolData';

function PoolInfoCard({ pool }: { pool: PoolData }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Overview" />
        <Tab label="Pool Info" />
      </Tabs>
      {activeTab === 0 && (
        <Stack spacing={2} divider={<Divider />}>
          <UserPoolBalance pool={pool} />
          <PoolStats pool={pool} />
          <PoolHealthBar pool={pool} />
        </Stack>
      )}
      {activeTab === 1 && (
        <Stack spacing={2} divider={<Divider />}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Created by</Typography>
            <Typography variant="body2">{pool.operator.name}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Created at</Typography>
            <Typography variant="body2">Dec 16, 2025</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Pool contract</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>0x1234...5678</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Pool capacity</Typography>
            <Typography variant="body2">1,000,000 SQD</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Max deposit per address</Typography>
            <Typography variant="body2">100,000 SQD</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Activation threshold</Typography>
            <Typography variant="body2">1,000,000 SQD</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Withdrawal window</Typography>
            <Typography variant="body2">{pool.withdrawalQueue.windowDuration}</Typography>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}

function PoolPageContent({ poolId }: { poolId?: string }) {
  const { data: pool, isLoading } = usePoolData(poolId);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!pool) {
    return <Box>Pool not found</Box>;
  }

  return (
    <>
      <PoolHeader pool={pool} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <PoolYieldChart
              monthlyPayoutUsd={pool.monthlyPayoutUsd}
              tvlInSqd={fromSqd(pool.tvl.max).toNumber()}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <PoolInfoCard pool={pool} />
            <Card>
              <Stack spacing={1.5}>
                <ProvideButton pool={pool} />
                <WithdrawButton pool={pool} />
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <PendingWithdrawals pool={pool} />
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
