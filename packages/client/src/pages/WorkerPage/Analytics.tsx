/**
 * Analytics Dashboard with Chart Configurations
 */

import { useMemo } from 'react';

import { Box, Grid, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useWorkerByPeerId } from '@api/subsquid-network-squid';
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
import { fromSqd } from '@lib/network';

// ============================================================================
// Chart Configuration Factory
// ============================================================================

const createWorkerChartConfigs = (
  workerId?: string,
): Record<string, AnalyticsChartProps<any, any>> => ({
  reward: {
    ...createStackedChart({
      title: 'Rewards',
      subtitle: 'Rewards distributed to worker and delegators',
      primaryColor: '#10B981',
      queryHook: opts => useQuery(trpc.timeseries.reward.queryOptions({ ...opts, workerId })),
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
      tooltipFormat: { y: CHART_FORMATTERS.token.tooltip },
      axisFormat: { y: CHART_FORMATTERS.token.axis },
      yAxis: { min: 0 },
      barBorderRadius: 2,
    }),
  },

  apr: {
    ...createMultiSeriesChart({
      title: 'APR',
      subtitle: 'Annual percentage rate for this worker and its delegators',
      primaryColor: '#6B7280',
      queryHook: opts => useQuery(trpc.timeseries.apr.queryOptions({ ...opts, workerId })),
      dataPath: (data: any) => data,
      series: [
        { name: 'Worker APR', valuePath: (v: any) => v?.workerApr, color: '#5B8FF9' },
        { name: 'Delegator APR', valuePath: (v: any) => v?.stakerApr, color: '#61CDBB' },
      ],
      tooltipFormat: { y: CHART_FORMATTERS.percent.tooltip },
      axisFormat: { y: CHART_FORMATTERS.percent.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  },
  uptime: {
    ...createSimpleChart({
      title: 'Uptime',
      subtitle: 'Worker uptime percentage over time',
      primaryColor: '#10B981',
      queryHook: opts => useQuery(trpc.timeseries.uptime.queryOptions({ ...opts, workerId })),
      dataPath: (data: any) => data,
      seriesName: 'Uptime',
      type: 'bar',
      tooltipFormat: { y: CHART_FORMATTERS.percent.tooltip },
      axisFormat: { y: CHART_FORMATTERS.percent.axis },
      yAxis: { min: 0, max: 100 },
      strokeWidth: 2,
      fillOpacity: 0.25,
    }),
  },

  queries: {
    ...createSimpleChart({
      title: 'Queries Count',
      subtitle: 'Queries processed by this worker',
      primaryColor: '#8B5CF6',
      queryHook: opts => useQuery(trpc.timeseries.queriesCount.queryOptions({ ...opts, workerId })),
      dataPath: (data: any) => data,
      seriesName: 'Queries',
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.number.tooltip },
      axisFormat: { y: CHART_FORMATTERS.number.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
      yAxis: { min: 0 },
    }),
  },

  servedData: {
    ...createSimpleChart({
      title: 'Served Data',
      subtitle: 'Data served by this worker',
      primaryColor: '#F59E0B',
      queryHook: opts => useQuery(trpc.timeseries.servedData.queryOptions({ ...opts, workerId })),
      dataPath: (data: any) => data,
      type: 'line',
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.3,
      yAxis: { min: 0 },
    }),
  },

  storedData: {
    ...createSimpleChart({
      title: 'Stored Data',
      subtitle: 'Data stored by this worker',
      primaryColor: '#4A90E2',
      queryHook: opts => useQuery(trpc.timeseries.storedData.queryOptions({ ...opts, workerId })),
      dataPath: (data: any) => data,
      tooltipFormat: { y: CHART_FORMATTERS.bytes.tooltip },
      axisFormat: { y: CHART_FORMATTERS.bytes.axis },
      strokeWidth: 2,
      fillOpacity: 0.25,
      yAxis: { min: 0 },
    }),
  },
});

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

const DEFAULT_TIME_RANGE = '30d';

export function WorkerAnalytics() {
  const { peerId } = useParams<{ peerId: string }>();
  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);

  const [state, setState] = useLocationState({
    timeRange: new Location.String(DEFAULT_TIME_RANGE),
    step: new Location.String('auto'),
  });

  const selectedPreset = useMemo(() => {
    return TIME_RANGE_PRESETS.find(p => p.value === state.timeRange) || TIME_RANGE_PRESETS[0];
  }, [state.timeRange]);

  const range = useMemo(() => {
    const parsed = parseTimeRange(selectedPreset.start, selectedPreset.end);
    return parsed;
  }, [selectedPreset]);

  const charts = useMemo(() => {
    const chartConfigs = createWorkerChartConfigs(worker?.id);
    return Object.entries(chartConfigs).map(([key, config]) => ({
      key,
      ...config,
    }));
  }, [worker?.id]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
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
          {charts.map(chart => {
            const { key, ...chartProps } = chart;
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
