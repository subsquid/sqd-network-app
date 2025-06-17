import React, { useMemo, useState } from 'react';

// Components
import { Card } from '@components/Card';
import { Box, Divider, Grid, Paper, Typography, useTheme } from '@mui/material';
import { SquaredChip } from '@components/Chip';
// Visx XYChart primitives
import {
  XYChart,
  Axis as ChartAxis,
  Grid as ChartGrid,
  Tooltip,
  buildChartTheme,
  LineSeries,
} from '@visx/xychart';
import {
  HoldersCountTimeseriesQuery,
  LockedValueTimeseriesQuery,
  ActiveWorkersTimeseriesQuery,
  useActiveWorkersTimeseriesQuery,
  useAprTimeseriesQuery,
  DelegationsTimeseriesQuery,
  useDelegationsTimeseriesQuery,
  DelegatorsTimeseriesQuery,
  useDelegatorsTimeseriesQuery,
  useHoldersCountTimeseriesQuery,
  useLockedValueTimeseriesQuery,
  useUniqueOperatorsTimeseriesQuery,
  UniqueOperatorsTimeseriesQuery,
  AprTimeseriesQuery,
  useRewardTimeseriesQuery,
  RewardTimeseriesQuery,
  useTransfersByTypeTimeseriesQuery,
  TransfersByTypeTimeseriesQuery,
  useUniqueAccountsTimeseriesQuery,
  UniqueAccountsTimeseriesQuery,
  useQueriesCountTimeseriesQuery,
  QueriesCountTimeseriesQuery,
  useServedDataTimeseriesQuery,
  ServedDataTimeseriesQuery,
  useStoredDataTimeseriesQuery,
  StoredDataTimeseriesQuery,
} from '@api/subsquid-network-squid';
import { subDays } from 'date-fns';
import { Loader } from '@components/Loader';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { fromSqd } from '@lib/network';
import { TimeRangePicker } from '@components/Form';
import { useLocationState, Location } from '@hooks/useLocationState';
import { groupBy } from 'lodash-es';

// ---------------------------------------------------------------------------
// Placeholder generators – replace with real API queries later

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function usePlaceholderStats() {
  return React.useMemo(() => {
    return {
      totalSupply: rand(80, 120) * 1_000_000,
      holdersCount: rand(30, 60) * 1_000,
      transfersCount: rand(5, 20) * 1_000_000,
    };
  }, []);
}

function usePlaceholderPie(name: 'holders' | 'token') {
  return React.useMemo(() => {
    const palette = ['#42a5f5', '#66bb6a', '#ffa726', '#26c6da', '#ab47bc'];
    if (name === 'holders') {
      return [
        { name: 'Users', value: rand(50, 70) },
        { name: 'Vestings', value: rand(10, 20) },
        { name: 'Temporary', value: rand(5, 15) },
      ].map((d, i) => ({ ...d, color: palette[i] }));
    }
    return [
      { name: 'Portals', value: rand(10, 30) },
      { name: 'Delegations', value: rand(10, 25) },
      { name: 'Temporary', value: rand(5, 15) },
      { name: 'Vestings', value: rand(10, 20) },
      { name: 'Workers', value: rand(10, 20) },
      { name: 'Transferable', value: rand(20, 40) },
    ].map((d, i) => ({ ...d, color: palette[i % palette.length] }));
  }, [name]);
}

function generateTimeseries(label: string): LineChartSeries[] {
  const days = Array.from({ length: 50 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return d;
  });
  return new Array(rand(2, 8)).fill(0).map((_, i) => ({
    name: label + i,
    data: days.map(d => ({ x: d, y: rand(i * 100, i * 100 + 100) })),
  }));
}

// Local types --------------------------------------------------------------
export type LineChartDatum = {
  /** X-axis value (e.g. Date or any ordinal category) */
  x: Date | number | string;
  /** Y-axis numeric value */
  y: number;
};

export interface LineChartSeries {
  /** Display name used in tooltip & legend */
  name: string;
  /** Optional hex/rgb colour; falls back to visx palette */
  color?: string;
  /** Array of {x, y} points */
  data: LineChartDatum[];
}

export interface LineChartProps {
  /** One or more series to render */
  series: LineChartSeries[];
  /** Chart height in pixels. Width is responsive to parent. */
  height?: number;
  /** If true, renders grid lines */
  showGrid?: boolean;
  /** Render an area under the line (Grafana style) */
  area?: boolean;
}

// ---------------------------------------------------------------------------
/**
 * Responsive XY line chart built with visx/xychart.
 * It intentionally has **no background** so it seamlessly blends with parent containers.
 *
 * Props allow custom colours, grid toggle & multiple series, but sensible defaults are provided.
 */
function LineChart({ series }: LineChartProps) {
  // Determine scale types based on first datum.
  // If x is Date -> time scale, otherwise treat as band (ordinal).
  const firstX = series?.[0]?.data?.[0]?.x;
  const xScaleType = firstX instanceof Date ? 'time' : 'band';
  const theme = useTheme();

  // Derive a palette from provided series colours (fallbacks handled by visx)
  const chartTheme = React.useMemo(() => {
    return buildChartTheme({
      colors: [
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.primary.main,
        theme.palette.secondary.main,
      ],
      gridColor: theme.palette.divider,
      gridColorDark: theme.palette.divider,
      gridStyles: {
        stroke: theme.palette.divider,
        strokeWidth: 0.5,
      },
      tickLength: 8,
      backgroundColor: theme.palette.background.paper,
    });
  }, [theme]);

  // Accessor helpers passed into visx series components
  const xAccessor = (d: LineChartDatum) => d.x;
  const yAccessor = (d: LineChartDatum) => d.y;

  return (
    <XYChart
      xScale={{ type: 'time' }}
      yScale={{ type: 'linear' }}
      theme={chartTheme}
      margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
    >
      {/* Axes */}
      <ChartAxis orientation="bottom" hideAxisLine hideTicks />
      <ChartAxis orientation="left" hideAxisLine hideTicks />

      <ChartGrid />

      {/* Data series */}
      {series.map(s => (
        <LineSeries
          key={s.name}
          dataKey={s.name}
          data={s.data}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
        />
      ))}

      {/* Tooltip configuration similar to visx demo */}
      <Tooltip<LineChartDatum>
        showSeriesGlyphs
        showVerticalCrosshair
        verticalCrosshairStyle={{ strokeDasharray: '4,4', strokeWidth: 1 }}
        snapTooltipToDatumX
        renderTooltip={({ tooltipData, colorScale }) => {
          if (!tooltipData) return null;

          return (
            <Paper variant="outlined">
              <>
                <Typography variant="body2">
                  {new Date(tooltipData.nearestDatum?.datum.x || 0).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}
                </Typography>
                <Divider sx={{ my: 0.5 }} />
                {Object.keys(tooltipData.datumByKey)
                  .sort((a, b) => -a.localeCompare(b))
                  .map(key => {
                    const datum = tooltipData.datumByKey[key];
                    return (
                      <Box
                        key={key}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          minWidth: 160,
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: colorScale?.(key) || 'transparent',
                            }}
                          />
                          <Typography variant="body2">{key}</Typography>
                        </Box>
                        <Typography variant="body2">{datum.datum.y}</Typography>
                      </Box>
                    );
                  })}
              </>
            </Paper>
          );
        }}
      />
    </XYChart>
  );
}

function AnalyticsChart<T>({
  title,
  range,
  queryHook,
  dataSelector,
}: {
  title: string;
  range: { from: Date; to: Date };
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataSelector: (data: T) => LineChartSeries[] | null | undefined;
}) {
  const queryVars = React.useMemo(() => {
    return {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    };
  }, [range]);

  const { data, isLoading } = queryHook(queryVars);

  const series: LineChartSeries[] = useMemo(() => {
    const timeseriesData = data ? dataSelector(data) : null;
    return timeseriesData || [];
  }, [data, dataSelector]);

  return (
    <Card title={<SquaredChip label={title} color="primary" />}>
      <Box height={200}>
        {isLoading ? (
          <Loader />
        ) : series ? (
          <LineChart series={series} />
        ) : (
          <Typography variant="body1">No data</Typography>
        )}
      </Box>
    </Card>
  );
}

export function HoldersCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<HoldersCountTimeseriesQuery>
      title="Holders Count"
      range={range}
      queryHook={useHoldersCountTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Holders',
          data: data.holdersCountTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function LockedValue({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<LockedValueTimeseriesQuery>
      title="Locked Value"
      range={range}
      queryHook={useLockedValueTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'TVL',
          data: data.lockedValueTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: fromSqd(d.value).toNumber(),
          })),
        },
      ]}
    />
  );
}

export function ActiveWorkersChart({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<ActiveWorkersTimeseriesQuery>
      title="Active Workers"
      range={range}
      queryHook={useActiveWorkersTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Active Workers',
          data: data.activeWorkersTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function UniqueOperatorsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<UniqueOperatorsTimeseriesQuery>
      title="Unique Operators Count"
      range={range}
      queryHook={useUniqueOperatorsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Operators',
          data: data.uniqueOperatorsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function DelegationsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<DelegationsTimeseriesQuery>
      title="Delegations Count"
      range={range}
      queryHook={useDelegationsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Delegations',
          data: data.delegationsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function UniqueDelegatorsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<DelegatorsTimeseriesQuery>
      title="Unique Delegators Count"
      range={range}
      queryHook={useDelegatorsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Delegators',
          data: data.delegatorsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function Apr({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<AprTimeseriesQuery>
      title="APR"
      range={range}
      queryHook={useAprTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Worker APR',
          data: data.aprTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value.workerApr,
          })),
        },
        {
          name: 'Staker APR',
          data: data.aprTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value.stakerApr,
          })),
        },
      ]}
    />
  );
}

export function Reward({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<RewardTimeseriesQuery>
      title="Reward"
      range={range}
      queryHook={useRewardTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Reward',
          data: data.rewardTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: fromSqd(d.value).toNumber(),
          })),
        },
      ]}
    />
  );
}

export function TransfersCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<TransfersByTypeTimeseriesQuery>
      title="Transfers Count"
      range={range}
      queryHook={useTransfersByTypeTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Transfers',
          data: Object.entries(groupBy(data.transfersByTypeTimeseries, d => d.timestamp)).map(
            ([type, transfers]) => ({
              x: new Date(transfers[0].timestamp),
              y: transfers.reduce((acc, d) => acc + d.value, 0),
            }),
          ),
        },
      ]}
    />
  );
}

export function UniqueAccountsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<UniqueAccountsTimeseriesQuery>
      title="Unique Accounts Count"
      range={range}
      queryHook={useUniqueAccountsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Accounts',
          data: data.uniqueAccountsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function QueriesCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<QueriesCountTimeseriesQuery>
      title="Queries Count"
      range={range}
      queryHook={useQueriesCountTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Queries',
          data: data.queriesCountTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function ServedData({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<ServedDataTimeseriesQuery>
      title="Served Data"
      range={range}
      queryHook={useServedDataTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Served Data',
          data: data.servedDataTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function StoredData({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<StoredDataTimeseriesQuery>
      title="Stored Data"
      range={range}
      queryHook={useStoredDataTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Stored Data',
          data: data.storedDataTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
        },
      ]}
    />
  );
}

export function Analytics() {
  const [range, setRange] = useLocationState({
    from: new Location.IsoDate(subDays(new Date(), 90)),
    to: new Location.IsoDate(new Date()),
  });

  return (
    <CenteredPageWrapper className="wide">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TimeRangePicker
          value={range}
          onChange={range => {
            setRange.from(range.from);
            setRange.to(range.to);
          }}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <HoldersCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LockedValue range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActiveWorkersChart range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueOperatorsCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DelegationsCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueDelegatorsCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Apr range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Reward range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TransfersCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueAccountsCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <QueriesCount range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ServedData range={range} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StoredData range={range} />
        </Grid>
      </Grid>
    </CenteredPageWrapper>
  );
}
