import { dateFormat } from '@i18n';
import { ButtonGroup, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useParams } from 'react-router-dom';
import { formatUnits } from 'viem';

import { useMockPortals, useAprTimeseriesQuery } from '@api/portal-pools';
import { Card } from '@components/Card';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { Property, PropertyList } from '@components/Property';
import { useMySources } from '@api/subsquid-network-squid';
import { AnalyticsChart, SharedCursorProvider } from '@components/Chart';
import { useState } from 'react';

export function PortalGeneral() {
  const { address } = useParams<{ address: string }>();
  const { mockPortals } = useMockPortals();
  const { isLoading: isSourcesLoading } = useMySources();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3 month'>('month');

  const portal = mockPortals.find(p => p.address === address);

  const isLoading = isSourcesLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (!portal || !address) {
    return <NotFound item="portal" id={address} />;
  }

  return (
    <>
      <SharedCursorProvider>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card title="Earnings" sx={{ width: 1, height: 1 }}>
              <PropertyList>
                <Property
                  label="Expected Rate"
                  value={`${formatUnits(portal.expectedRatePerDay, 6)} USDC/day`}
                />
                <Property
                  label="Payment Tokens"
                  value={portal.paymentTokens.length > 0 ? 'USDC' : '-'}
                />
                <Property
                  label="Collection Period"
                  value={
                    portal.depositDeadline
                      ? dateFormat(Number(portal.depositDeadline), 'dateTime')
                      : '-'
                  }
                />
              </PropertyList>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <AnalyticsChart
              title="APY"
              primaryColor="#10B981"
              action={
                <ToggleButtonGroup
                  exclusive
                  value={timeRange}
                  onChange={(_, value) => setTimeRange(value)}
                >
                  <ToggleButton value="week">1W</ToggleButton>
                  <ToggleButton value="month">1M</ToggleButton>
                  <ToggleButton value="3 month">3M</ToggleButton>
                </ToggleButtonGroup>
              }
              queryHook={useAprTimeseriesQuery}
              dataPath={(data: any) => data.aprTimeseries}
              seriesName="APY"
              range={
                timeRange === 'week'
                  ? { from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() }
                  : timeRange === 'month'
                    ? { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() }
                    : { from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), to: new Date() }
              }
            />
          </Grid>
        </Grid>
      </SharedCursorProvider>
    </>
  );
}
