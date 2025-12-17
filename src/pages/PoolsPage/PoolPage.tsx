import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

import { Card } from '@components/Card';
import { Property, PropertyList } from '@components/Property';
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
import { dateFormat } from '@i18n';

function PoolInfoCard({ pool }: { pool: PoolData }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="Delegate" />
        <Tab label="Manage" />
        <Tab label="Info" />
      </Tabs>
      <Box height="100%" display="flex" flexDirection="column" gap={2} justifyContent="stretch">
        {activeTab === 0 && (
          <>
            <Card sx={{ height: '100%' }}>
              <Stack spacing={2} divider={<Divider />}>
                <UserPoolBalance pool={pool} />
                <Stack spacing={1.5} direction="row" justifyContent="space-between">
                  <ProvideButton pool={pool} />
                  <WithdrawButton pool={pool} />
                </Stack>
              </Stack>
            </Card>
          </>
        )}
        {activeTab === 1 && (
          <>
            <Card sx={{ height: '100%' }}>
              <Stack spacing={2} divider={<Divider />}></Stack>
            </Card>
          </>
        )}
        {activeTab === 2 && (
          <Card sx={{ height: '100%' }}>
            <Stack divider={<Divider />} spacing={2}>
              <PropertyList>
                <Property label="Operator" value={pool.operator.name} />
                <Property
                  label="Created"
                  value={dateFormat(new Date('2025-12-16T12:00:00Z'), 'dateTime')}
                />
              </PropertyList>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum
              </Typography>
            </Stack>
          </Card>
        )}
      </Box>
    </>
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
              <PoolInfoCard pool={pool} />
            </Stack>
          </Grid>
        </Grid>

        <PendingWithdrawals pool={pool} />
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
