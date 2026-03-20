/**
 * Analytics Dashboard with Chart Configurations
 */

import { useMemo, useState } from 'react';

import { Box, Grid, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import {
  AnalyticsChart,
  type AnalyticsChartProps,
  CHART_FORMATTERS,
  SharedCursorProvider,
  createMultiSeriesChart,
  createSimpleChart,
  createStackedChart,
} from '@components/Chart';
import { Location, useLocationState } from '@hooks/useLocationState';
import { parseTimeRange } from '@lib/datemath';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

// ============================================================================
// Types
// ============================================================================

type ChartCategory = 'network' | 'economics' | 'usage';

interface ChartEntry {
  key: string;
  category: ChartCategory;
  render: (props: { range?: { from: Date; to: Date }; step?: string }) => React.ReactNode;
}

// ============================================================================
// Helpers
// ============================================================================

function sqd(v: unknown): number | null {
  return v != null ? fromSqd(v as string).toNumber() : null;
}

function sqdOrZero(v: unknown): number {
  return v != null ? fromSqd(v as string).toNumber() : 0;
}

const tokenFormatWhole = {
  tooltip: (d: number) => tokenFormatter(d, 'SQD', 0),
  axis: (d: number) =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(d),
};

function configChart(
  key: string,
  category: ChartCategory,
  config: AnalyticsChartProps<any, any>,
): ChartEntry {
  return {
    key,
    category,
    render: ({ range, step }) => <AnalyticsChart {...config} range={range} step={step} />,
  };
}

// ============================================================================
// Locked Value Chart
// ============================================================================

const LOCKED_VALUE_SERIES = [
  { name: 'Workers', valuePath: (v: any) => sqd(v?.worker), color: '#5B8FF9' },
  { name: 'Delegations', valuePath: (v: any) => sqd(v?.delegation), color: '#61CDBB' },
  { name: 'Portals', valuePath: (v: any) => sqd(v?.portal), color: '#F59E0B' },
  { name: 'Portal Pools', valuePath: (v: any) => sqd(v?.portalPool), color: '#8B5CF6' },
];

function lockedValueTotal(v: any): number {
  return (
    sqdOrZero(v?.worker) +
    sqdOrZero(v?.delegation) +
    sqdOrZero(v?.portal) +
    sqdOrZero(v?.portalPool)
  );
}

const lockedValueQueryHook = (vars: { from: string; to: string; step?: string }) =>
  useQuery(
    trpc.timeseries.lockedValue.queryOptions(vars, {
      trpc: { context: { skipBatch: true } },
    }),
  );

function LockedValueChart({ range, step }: { range?: { from: Date; to: Date }; step?: string }) {
  const [split, setSplit] = useState(true);

  return (
    <AnalyticsChart
      title="Locked Value"
      subtitle="Total value locked in the network"
      primaryColor="#4A90E2"
      queryHook={lockedValueQueryHook}
      dataPath={(data: any) => data}
      tooltipFormat={{ y: tokenFormatWhole.tooltip }}
      axisFormat={{ y: tokenFormatWhole.axis }}
      strokeWidth={2}
      fillOpacity={0.25}
      yAxis={{ min: 0 }}
      range={range}
      step={step}
      series={split ? LOCKED_VALUE_SERIES : undefined}
      seriesName={split ? undefined : 'TVL'}
      valueTransform={split ? undefined : lockedValueTotal}
      // action={
      //   <FormControlLabel
      //     control={
      //       <Switch
      //         color="info"
      //         checked={split}
      //         onChange={(_, checked) => setSplit(checked)}
      //         size="small"
      //       />
      //     }
      //     label="Split"
      //     labelPlacement="start"
      //     sx={{ mr: 0, gap: 0.5 }}
      //   />
      // }
    />
  );
}

// ============================================================================
// Chart Configurations
// ============================================================================

const CHARTS: ChartEntry[] = [
  {
    key: 'lockedValue',
    category: 'economics',
    render: props => <LockedValueChart {...props} />,
  },

  configChart('activeWorkers', 'network', {
    ...createSimpleChart({
      title: 'Active Workers',
      subtitle: 'Number of workers actively processing queries',
      primaryColor: '#10B981',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.activeWorkers.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('reward', 'economics', {
    ...createStackedChart({
      title: 'Rewards',
      subtitle: 'Rewards distributed to workers and delegators',
      primaryColor: '#10B981',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.reward.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      stacks: [
        {
          key: 'Worker Reward',
          valuePath: (v: any) => fromSqd(v?.workerReward).toNumber(),
          color: '#5B8FF9',
        },
        {
          key: 'Staker Reward',
          valuePath: (v: any) => fromSqd(v?.stakerReward).toNumber(),
          color: '#61CDBB',
        },
      ],
      tooltipFormat: { y: tokenFormatWhole.tooltip },
      axisFormat: { y: tokenFormatWhole.axis },
      yAxis: { min: 0 },
      barBorderRadius: 2,
    }),
  }),

  configChart('apr', 'economics', {
    ...createMultiSeriesChart({
      title: 'APR',
      subtitle: 'Annual percentage rate for workers and delegators',
      primaryColor: '#6B7280',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.apr.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      series: [
        { name: 'Worker APR', valuePath: (v: any) => v?.workerApr, color: '#5B8FF9' },
        { name: 'Delegator APR', valuePath: (v: any) => v?.stakerApr, color: '#61CDBB' },
      ],
      tooltipFormat: { y: CHART_FORMATTERS.percent.tooltip },
      axisFormat: { y: CHART_FORMATTERS.percent.axis },
      tooltipShowTotal: false,
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('uniqueOperators', 'network', {
    ...createSimpleChart({
      title: 'Unique Operators',
      subtitle: 'Distinct operators running workers',
      primaryColor: '#8B5CF6',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.uniqueOperators.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('delegations', 'network', {
    ...createSimpleChart({
      title: 'Delegations',
      subtitle: 'Total active delegation contracts',
      primaryColor: '#F59E0B',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.delegations.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('uniqueDelegators', 'network', {
    ...createSimpleChart({
      title: 'Unique Delegators',
      subtitle: 'Number of unique delegating accounts',
      primaryColor: '#06B6D4',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.delegators.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('transfers', 'economics', {
    ...createStackedChart({
      title: 'Transfers',
      subtitle: 'Token transfer activity by type',
      primaryColor: '#6B7280',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.transfersByType.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      stacks: [
        { key: 'Transfer', valuePath: (v: any) => v?.transfer ?? 0, color: '#4A90E2' },
        { key: 'Deposit', valuePath: (v: any) => v?.deposit ?? 0, color: '#10B981' },
        { key: 'Withdraw', valuePath: (v: any) => v?.withdraw ?? 0, color: '#F59E0B' },
        { key: 'Reward', valuePath: (v: any) => v?.reward ?? 0, color: '#8B5CF6' },
        { key: 'Release', valuePath: (v: any) => v?.release ?? 0, color: '#06B6D4' },
      ],
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      yAxis: { min: 0 },
      barBorderRadius: 2,
    }),
  }),

  configChart('uniqueAccounts', 'usage', {
    ...createSimpleChart({
      title: 'Active Accounts',
      subtitle: 'Accounts with recent activity',
      primaryColor: '#06B6D4',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.uniqueAccounts.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      seriesName: 'Unique Accounts',
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),

  configChart('queries', 'usage', {
    ...createSimpleChart({
      title: 'Queries Count',
      subtitle: 'Total queries processed',
      primaryColor: '#8B5CF6',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.queriesCount.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      seriesName: 'Queries',
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
      yAxis: { min: 0 },
    }),
  }),

  configChart('servedData', 'usage', {
    ...createSimpleChart({
      title: 'Served Data',
      subtitle: 'Total data served to clients',
      primaryColor: '#F59E0B',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.servedData.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
      yAxis: { min: 0 },
    }),
  }),

  configChart('storedData', 'usage', {
    ...createSimpleChart({
      title: 'Stored Data',
      subtitle: 'Total data stored in the network',
      primaryColor: '#4A90E2',
      queryHook: vars =>
        useQuery(
          trpc.timeseries.storedData.queryOptions(vars, {
            trpc: { context: { skipBatch: true } },
          }),
        ),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  }),
];

// ============================================================================
// Analytics Component
// ============================================================================

const TIME_RANGE_PRESETS = [
  { label: '30 days', value: '30d', start: 'now/d-30d', end: 'now/d' },
  { label: '90 days', value: '90d', start: 'now/d-90d', end: 'now/d' },
  { label: '6 months', value: '6M', start: 'now/d-6M', end: 'now/d' },
  { label: '1 year', value: '1y', start: 'now/d-1y', end: 'now/d' },
  { label: 'All time', value: 'all', start: undefined, end: 'now/d' },
];

const DEFAULT_TIME_RANGE = 'all';

const CATEGORY_TABS = [
  { label: 'All', value: 'all' as const },
  { label: 'Network Health', value: 'network' as const },
  { label: 'Economics', value: 'economics' as const },
  { label: 'Usage', value: 'usage' as const },
];

export function Analytics() {
  const [state, setState] = useLocationState({
    timeRange: new Location.String(DEFAULT_TIME_RANGE),
    category: new Location.String('all'),
    step: new Location.String('auto'),
  });

  const selectedPreset = useMemo(() => {
    return TIME_RANGE_PRESETS.find(p => p.value === state.timeRange) || TIME_RANGE_PRESETS[0];
  }, [state.timeRange]);

  const range = useMemo(() => {
    const parsed = parseTimeRange(selectedPreset.start, selectedPreset.end);
    return parsed;
  }, [selectedPreset]);

  const filteredCharts = useMemo(() => {
    if (state.category === 'all') {
      return CHARTS;
    }
    return CHARTS.filter(chart => chart.category === state.category);
  }, [state.category]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <ToggleButtonGroup
          value={state.category}
          exclusive
          onChange={(_, value) => value && setState.category(value)}
        >
          {CATEGORY_TABS.map(tab => (
            <ToggleButton key={tab.value} value={tab.value}>
              {tab.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Select
          value={state.timeRange}
          onChange={e => setState.timeRange(e.target.value)}
          variant="filled"
          disableUnderline
          size="small"
        >
          {TIME_RANGE_PRESETS.map(preset => (
            <MenuItem key={preset.value} value={preset.value}>
              {preset.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <SharedCursorProvider>
        <Grid container spacing={2}>
          {filteredCharts.map(chart => (
            <Grid key={chart.key} size={{ xs: 12, md: 6 }}>
              {chart.render({ range, step: state.step })}
            </Grid>
          ))}
        </Grid>
      </SharedCursorProvider>
    </>
  );
}
