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
  BarSeries,
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
import { bytesFormatter, percentFormatter, tokenFormatter } from '@lib/formatters/formatters';

// ---------------------------------------------------------------------------
// Placeholder generators – replace with real API queries later

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const toCompact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const toNumber = new Intl.NumberFormat('en-US');

const toDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

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

// Local types --------------------------------------------------------------
export type LineChartDatum<T> = {
  /** X-axis value (e.g. Date or any ordinal category) */
  x: Date | number | string;
  /** Y-axis numeric value */
  y: T;
};

export interface LineChartSeries<T> {
  /** Display name used in tooltip & legend */
  name: string;
  /** Optional hex/rgb colour; falls back to visx palette */
  color?: string;
  /** Array of {x, y} points */
  data: LineChartDatum<T>[];

  type: 'line' | 'bar';
}

export interface LineChartProps<T> {
  /** One or more series to render */
  series: LineChartSeries<T>[];
  /** Chart height in pixels. Width is responsive to parent. */
  height?: number;
  /** If true, renders grid lines */
  showGrid?: boolean;
  /** Render an area under the line (Grafana style) */
  area?: boolean;
  min?: number;
  max?: number;
  minX?: Date | number;
  maxX?: Date | number;

  tooltipFormat?: {
    x?: (x: Date | number | string) => string;
    y?: (y: T) => string;
  };

  axisFormat?: {
    x?: (x: Date | number | string) => string;
    y?: (y: T) => string;
  };
}

// ---------------------------------------------------------------------------
/**
 * Responsive XY line chart built with visx/xychart.
 * It intentionally has **no background** so it seamlessly blends with parent containers.
 *
 * Props allow custom colours, grid toggle & multiple series, but sensible defaults are provided.
 */
function LineChart<T = number>({
  series,
  axisFormat,
  tooltipFormat,
  min,
  max,
  minX,
  maxX,
}: LineChartProps<T>) {
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
  const xAccessor = (d: LineChartDatum<T>) => d.x;
  const yAccessor = (d: LineChartDatum<T>) => d.y;

  const yScale: any = { type: 'linear', nice: false, zero: false };
  if (min !== undefined || max !== undefined) {
    yScale.domain = [min, max];
  }

  const xScale: any = { type: 'time' };
  if (minX !== undefined || maxX !== undefined) {
    xScale.domain = [minX, maxX];
  }

  return (
    <XYChart
      xScale={xScale}
      yScale={yScale}
      theme={chartTheme}
      margin={{ top: 8, right: 16, bottom: 24, left: 40 }}
    >
      {/* Axes */}
      <ChartAxis orientation="bottom" numTicks={5} strokeWidth={2} tickFormat={axisFormat?.x} />
      <ChartAxis orientation="left" numTicks={5} strokeWidth={2} tickFormat={axisFormat?.y} />

      {/* Data series */}
      {series.map(s => {
        switch (s.type) {
          case 'line':
            return (
              <LineSeries
                key={s.name}
                dataKey={s.name}
                data={s.data}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                strokeWidth={4}
                radius={4}
              />
            );
          case 'bar':
            return (
              <BarSeries
                key={s.name}
                dataKey={s.name}
                data={s.data}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                barPadding={0.4}
                radius={4}
                radiusAll
              />
            );
          default:
            return null;
        }
      })}

      {/* Tooltip configuration similar to visx demo */}
      <Tooltip<LineChartDatum<T>>
        showSeriesGlyphs
        glyphStyle={{ strokeWidth: 0 }}
        showVerticalCrosshair
        showHorizontalCrosshair
        verticalCrosshairStyle={{ strokeDasharray: '4,4', strokeWidth: 1 }}
        horizontalCrosshairStyle={{ strokeDasharray: '4,4', strokeWidth: 1 }}
        renderTooltip={({ tooltipData, colorScale }) => {
          if (!tooltipData) return null;

          return (
            <Paper variant="outlined">
              <>
                {tooltipData.nearestDatum ? (
                  <>
                    <Typography variant="body2">
                      {tooltipFormat?.x
                        ? tooltipFormat.x(tooltipData.nearestDatum.datum.x)
                        : String(tooltipData.nearestDatum?.datum.x)}
                    </Typography>
                    <Divider sx={{ my: 0.5 }} />
                  </>
                ) : null}
                {Object.values(tooltipData.datumByKey).map(datum => {
                  const key = datum.key;
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
                      <Typography variant="body2">
                        {tooltipFormat?.y ? tooltipFormat.y(datum.datum.y) : String(datum.datum.y)}
                      </Typography>
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

function AnalyticsChart<T, V>({
  title,
  range,
  queryHook,
  dataSelector,
  tooltipFormat,
  axisFormat,
}: {
  title: string;
  range: { from: Date; to: Date };
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataSelector: (data: T) => LineChartSeries<V>[] | null | undefined;
  tooltipFormat?: LineChartProps<V>['tooltipFormat'];
  axisFormat?: LineChartProps<V>['axisFormat'];
}) {
  const queryVars = React.useMemo(() => {
    return {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    };
  }, [range]);

  const { data, isLoading } = queryHook(queryVars);

  const series: LineChartSeries<V>[] = useMemo(() => {
    const timeseriesData = data ? dataSelector(data) : null;
    return timeseriesData || [];
  }, [data, dataSelector]);

  const hasData = useMemo(() => series.flatMap(s => s.data).length > 0, [series]);

  const [min, max] = useMemo(() => {
    if (!hasData) {
      return [undefined, undefined];
    }
    const values = series.flatMap(s => s.data.map(d => d.y as number));

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    let finalMin, finalMax;

    if (minVal === maxVal) {
      const padding = Math.abs(maxVal * 0.1) || 1;
      finalMin = minVal - padding;
      finalMax = maxVal + padding;
    } else {
      const padding = (maxVal - minVal) * 0.1;
      finalMin = minVal >= 0 ? Math.max(minVal - padding, 0) : minVal - padding;
      finalMax = maxVal <= 0 ? Math.min(maxVal + padding, 0) : maxVal + padding;
    }

    return [finalMin, finalMax];
  }, [series, hasData]);

  const [minX, maxX] = useMemo(() => {
    if (!hasData) {
      return [undefined, undefined];
    }
    const values = series.flatMap(s => s.data.map(d => (d.x as Date).getTime()));

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    let finalMin, finalMax;

    if (minVal === maxVal) {
      const oneDay = 24 * 60 * 60 * 1000;
      finalMin = minVal - oneDay;
      finalMax = maxVal + oneDay;
    } else {
      const padding = (maxVal - minVal) * 0.02;
      finalMin = minVal - padding;
      finalMax = maxVal + padding;
    }

    return [new Date(finalMin), new Date(finalMax)];
  }, [series, hasData]);

  return (
    <Card title={<SquaredChip label={title} color="primary" />}>
      <Box height={200}>
        {isLoading ? (
          <Loader />
        ) : hasData ? (
          <LineChart
            series={series}
            tooltipFormat={{
              x: d => toDate.format(new Date(d)),
              ...tooltipFormat,
            }}
            axisFormat={axisFormat}
            min={min}
            max={max}
            minX={minX}
            maxX={maxX}
          />
        ) : (
          <Typography variant="body1">No data</Typography>
        )}
      </Box>
    </Card>
  );
}

export function HoldersCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<HoldersCountTimeseriesQuery, number>
      title="Holders"
      range={range}
      queryHook={useHoldersCountTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Holders',
          data: data.holdersCountTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => new Intl.NumberFormat('en-US').format(d),
      }}
      axisFormat={{
        y: d => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(d),
      }}
    />
  );
}

export function LockedValue({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<LockedValueTimeseriesQuery, number>
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
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => tokenFormatter(d, 'SQD'),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function ActiveWorkersChart({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<ActiveWorkersTimeseriesQuery, number>
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
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function UniqueOperatorsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<UniqueOperatorsTimeseriesQuery, number>
      title="Unique Operators"
      range={range}
      queryHook={useUniqueOperatorsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Operators',
          data: data.uniqueOperatorsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function DelegationsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<DelegationsTimeseriesQuery, number>
      title="Delegations"
      range={range}
      queryHook={useDelegationsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Delegations',
          data: data.delegationsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function UniqueDelegatorsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<DelegatorsTimeseriesQuery, number>
      title="Unique Delegators"
      range={range}
      queryHook={useDelegatorsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Delegators',
          data: data.delegatorsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function Apr({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<AprTimeseriesQuery, number>
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
          type: 'line',
        },
        {
          name: 'Staker APR',
          data: data.aprTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value.stakerApr,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => percentFormatter(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function Reward({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<RewardTimeseriesQuery, number>
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
          type: 'bar',
        },
      ]}
      tooltipFormat={{
        y: d => tokenFormatter(d, 'SQD'),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function TransfersCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<TransfersByTypeTimeseriesQuery, number>
      title="Transfers"
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
          type: 'bar',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function UniqueAccountsCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<UniqueAccountsTimeseriesQuery, number>
      title="Active Accounts"
      range={range}
      queryHook={useUniqueAccountsTimeseriesQuery}
      dataSelector={data => [
        {
          name: 'Unique Accounts',
          data: data.uniqueAccountsTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: d.value,
          })),
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function QueriesCount({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<QueriesCountTimeseriesQuery, number>
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
          type: 'bar',
        },
      ]}
      tooltipFormat={{
        y: d => toNumber.format(d),
      }}
      axisFormat={{
        y: d => toCompact.format(d),
      }}
    />
  );
}

export function ServedData({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<ServedDataTimeseriesQuery, number>
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
          type: 'bar',
        },
      ]}
      tooltipFormat={{
        y: d => bytesFormatter(d),
      }}
      axisFormat={{
        y: d => bytesFormatter(d, true),
      }}
    />
  );
}

export function StoredData({ range }: { range: { from: Date; to: Date } }) {
  return (
    <AnalyticsChart<StoredDataTimeseriesQuery, number>
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
          type: 'line',
        },
      ]}
      tooltipFormat={{
        y: d => bytesFormatter(d),
      }}
      axisFormat={{
        y: d => bytesFormatter(d, true),
      }}
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
