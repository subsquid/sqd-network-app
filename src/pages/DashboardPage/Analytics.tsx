/**
 * Analytics Dashboard with Chart Configurations
 */

import {
  useActiveWorkersTimeseriesQuery,
  useAprTimeseriesQuery,
  useDelegationsTimeseriesQuery,
  useDelegatorsTimeseriesQuery,
  useLockedValueTimeseriesQuery,
  useQueriesCountTimeseriesQuery,
  useRewardTimeseriesQuery,
  useServedDataTimeseriesQuery,
  useStoredDataTimeseriesQuery,
  useTransfersByTypeTimeseriesQuery,
  useUniqueAccountsTimeseriesQuery,
  useUniqueOperatorsTimeseriesQuery,
} from '@api/subsquid-network-squid';
import {
  AnalyticsChart,
  CHART_FORMATTERS,
  createMultiSeriesChart,
  createSimpleChart,
  createStackedChart,
  SharedCursorProvider,
  type AnalyticsChartProps,
} from '@components/Chart';
import { Location, useLocationState } from '@hooks/useLocationState';
import { parseTimeRange } from '@lib/datemath';
import { fromSqd } from '@lib/network';
import { Box, Grid, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

type ChartCategory = 'network' | 'economics' | 'usage';

// ============================================================================
// Chart Configurations
// ============================================================================

const CHART_CONFIGS: Record<string, AnalyticsChartProps<any, any>> = {
  lockedValue: {
    ...createSimpleChart({
      title: 'Locked Value',
      subtitle: 'Total value locked in the network',
      primaryColor: '#4A90E2',
      queryHook: useLockedValueTimeseriesQuery,
      dataPath: (data: any) => data.lockedValueTimeseries,
      seriesName: 'TVL',
      tooltipFormat: { y: CHART_FORMATTERS.token.tooltip },
      axisFormat: { y: CHART_FORMATTERS.token.axis },
      valueTransform: (v: any) => fromSqd(v).toNumber(),
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'economics' as ChartCategory,
  },

  activeWorkers: {
    ...createSimpleChart({
      title: 'Active Workers',
      subtitle: 'Number of workers actively processing queries',
      primaryColor: '#10B981',
      queryHook: useActiveWorkersTimeseriesQuery,
      dataPath: (data: any) => data.activeWorkersTimeseries,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'network' as ChartCategory,
  },

  reward: {
    ...createStackedChart({
      title: 'Rewards',
      subtitle: 'Rewards distributed to workers and stakers',
      primaryColor: '#10B981',
      queryHook: opts =>
        useRewardTimeseriesQuery({ from: opts.from, to: opts.to, step: opts.step }),
      dataPath: (data: any) => data.rewardTimeseries,
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
      tooltipFormat: { y: CHART_FORMATTERS.token.tooltip },
      axisFormat: { y: CHART_FORMATTERS.token.axis },
      yAxis: { min: 0 },
      barBorderRadius: 2,
    }),
    category: 'economics' as ChartCategory,
  },

  apr: {
    ...createMultiSeriesChart({
      title: 'APR',
      subtitle: 'Annual percentage rate for workers and stakers',
      primaryColor: '#6B7280',
      queryHook: useAprTimeseriesQuery,
      dataPath: (data: any) => data.aprTimeseries,
      series: [
        { name: 'Worker APR', valuePath: (v: any) => v?.workerApr, color: '#5B8FF9' },
        { name: 'Staker APR', valuePath: (v: any) => v?.stakerApr, color: '#61CDBB' },
      ],
      tooltipFormat: { y: CHART_FORMATTERS.percent.tooltip },
      axisFormat: { y: CHART_FORMATTERS.percent.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'economics' as ChartCategory,
  },

  uniqueOperators: {
    ...createSimpleChart({
      title: 'Unique Operators',
      subtitle: 'Distinct operators running workers',
      primaryColor: '#8B5CF6',
      queryHook: useUniqueOperatorsTimeseriesQuery,
      dataPath: (data: any) => data.uniqueOperatorsTimeseries,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'network' as ChartCategory,
  },

  delegations: {
    ...createSimpleChart({
      title: 'Delegations',
      subtitle: 'Total active delegation contracts',
      primaryColor: '#F59E0B',
      queryHook: useDelegationsTimeseriesQuery,
      dataPath: (data: any) => data.delegationsTimeseries,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'network' as ChartCategory,
  },

  uniqueDelegators: {
    ...createSimpleChart({
      title: 'Unique Delegators',
      subtitle: 'Number of unique delegating accounts',
      primaryColor: '#06B6D4',
      queryHook: useDelegatorsTimeseriesQuery,
      dataPath: (data: any) => data.delegatorsTimeseries,
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'network' as ChartCategory,
  },

  transfers: {
    ...createStackedChart({
      title: 'Transfers',
      subtitle: 'Token transfer activity by type',
      primaryColor: '#6B7280',
      queryHook: useTransfersByTypeTimeseriesQuery,
      dataPath: (data: any) => data.transfersByTypeTimeseries,
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
    category: 'economics' as ChartCategory,
  },

  uniqueAccounts: {
    ...createSimpleChart({
      title: 'Active Accounts',
      subtitle: 'Accounts with recent activity',
      primaryColor: '#06B6D4',
      queryHook: useUniqueAccountsTimeseriesQuery,
      dataPath: (data: any) => data.uniqueAccountsTimeseries,
      seriesName: 'Unique Accounts',
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'usage' as ChartCategory,
  },

  queries: {
    ...createSimpleChart({
      title: 'Queries Count',
      subtitle: 'Total queries processed',
      primaryColor: '#8B5CF6',
      queryHook: useQueriesCountTimeseriesQuery,
      dataPath: (data: any) => data.queriesCountTimeseries,
      seriesName: 'Queries',
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
    }),
    category: 'usage' as ChartCategory,
  },

  servedData: {
    ...createSimpleChart({
      title: 'Served Data',
      subtitle: 'Total data served to clients',
      primaryColor: '#F59E0B',
      queryHook: useServedDataTimeseriesQuery,
      dataPath: (data: any) => data.servedDataTimeseries,
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
    }),
    category: 'usage' as ChartCategory,
  },

  storedData: {
    ...createSimpleChart({
      title: 'Stored Data',
      subtitle: 'Total data stored in the network',
      primaryColor: '#4A90E2',
      queryHook: useStoredDataTimeseriesQuery,
      dataPath: (data: any) => data.storedDataTimeseries,
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
    category: 'usage' as ChartCategory,
  },
};

const CHARTS = Object.entries(CHART_CONFIGS).map(([key, config]) => ({
  key,
  ...config,
}));

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
          {filteredCharts.map(chart => {
            const { key, category, ...chartProps } = chart;
            return (
              <Grid key={key} size={{ xs: 12, md: 6 }}>
                <AnalyticsChart {...chartProps} range={range} step={state.step} />
              </Grid>
            );
          })}
        </Grid>
      </SharedCursorProvider>
    </>
  );
}
