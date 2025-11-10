/**
 * Chart Configurations for Analytics Dashboard
 *
 * This file contains all chart configurations including:
 * - Formatter presets for common data types
 * - Helper functions for creating chart configs
 * - Individual chart configurations
 */

import {
  useActiveWorkersTimeseriesQuery,
  useAprTimeseriesQuery,
  useDelegationsTimeseriesQuery,
  useDelegatorsTimeseriesQuery,
  useLockedValueTimeseriesQuery,
  useUniqueOperatorsTimeseriesQuery,
  useRewardTimeseriesQuery,
  useTransfersByTypeTimeseriesQuery,
  useUniqueAccountsTimeseriesQuery,
  useQueriesCountTimeseriesQuery,
  useServedDataTimeseriesQuery,
  useStoredDataTimeseriesQuery,
} from '@api/subsquid-network-squid';
import { fromSqd } from '@lib/network';
import {
  bytesFormatter,
  percentFormatter,
  tokenFormatter,
  toCompact,
  toNumber,
} from '@lib/formatters/formatters';
import type { LineChartProps, LineChartSeries } from './Analytics';

// ============================================================================
// Types
// ============================================================================

export type ChartCategory = 'network' | 'economics' | 'usage';

export interface ChartConfig<T> {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  category: ChartCategory;
  queryHook: (vars: { from: string; to: string; step?: string }) => {
    data: T | undefined;
    isLoading: boolean;
  };
  dataSelector: (data: T) => { series: LineChartSeries[]; step?: number } | null | undefined;
  tooltipFormat?: LineChartProps['tooltipFormat'];
  axisFormat?: LineChartProps['axisFormat'];
  yAxisScale?: 'linear' | 'log';
  // Layout configuration
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  // Visual styling
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
  grouped?: boolean; // For grouped bar charts
}

// ============================================================================
// Formatters
// ============================================================================

/**
 * Available formatter presets for charts
 */
export const FORMATTERS = {
  number: {
    tooltip: (d: number) => toNumber.format(d),
    axis: (d: number) => toCompact.format(d),
  },
  compactNumber: {
    tooltip: (d: number) => new Intl.NumberFormat('en-US').format(d),
    axis: (d: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(d),
  },
  token: {
    tooltip: (d: number) => tokenFormatter(d, 'SQD'),
    axis: (d: number) => toCompact.format(d),
  },
  percent: {
    tooltip: (d: number) => percentFormatter(d),
    axis: (d: number) => percentFormatter(d, 0),
  },
  bytes: {
    tooltip: (d: number) => bytesFormatter(d),
    axis: (d: number) => bytesFormatter(d, true),
  },
} as const;

export type FormatterPreset = keyof typeof FORMATTERS;

// ============================================================================
// Chart Configuration Helpers
// ============================================================================

/**
 * Create a simple line/bar chart configuration with a single value series
 */
export function createSimpleChart<T extends Record<string, any>>(config: {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  category: ChartCategory;
  queryHook: (vars: { from: string; to: string; step?: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => { data: Array<{ timestamp: string; value: number | null | undefined }>; step?: number };
  seriesName?: string;
  type?: 'line' | 'bar';
  formatter?: FormatterPreset;
  valueTransform?: (value: number) => number;
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
}): ChartConfig<T> {
  const {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataPath,
    seriesName = title,
    type = 'line',
    formatter = 'number',
    valueTransform = v => v,
    height,
    gridSize,
    strokeWidth,
    fillOpacity,
    pointSize,
    barBorderRadius,
  } = config;

  return {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataSelector: (data: T) => {
      const timeseries = dataPath(data);
      return {
        series: [
          {
            name: seriesName,
            data: timeseries.data
              .filter(d => d.value != null)
              .map(d => ({
                x: new Date(d.timestamp),
                y: d.value != null ? valueTransform(d.value) : null,
              })),
            type,
          },
        ],
        step: timeseries.step,
      };
    },
    tooltipFormat: { y: FORMATTERS[formatter].tooltip },
    axisFormat: { y: FORMATTERS[formatter].axis },
    height,
    gridSize,
    strokeWidth,
    fillOpacity,
    pointSize,
    barBorderRadius,
  };
}

/**
 * Create a multi-series line chart configuration
 */
export function createMultiSeriesChart<T extends Record<string, any>, V = any>(config: {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  category: ChartCategory;
  queryHook: (vars: { from: string; to: string; step?: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => { data: Array<{ timestamp: string; value: V }>; step?: number };
  series: Array<{
    name: string;
    valuePath: (value: V) => number | null | undefined;
    color?: string;
  }>;
  type?: 'line' | 'bar';
  grouped?: boolean;
  formatter?: FormatterPreset;
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
}): ChartConfig<T> {
  const {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataPath,
    series,
    type = 'line',
    grouped,
    formatter = 'number',
    height,
    gridSize,
    strokeWidth,
    fillOpacity,
    pointSize,
    barBorderRadius,
  } = config;

  return {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataSelector: (data: T) => {
      const timeseries = dataPath(data);
      return {
        series: series.map(s => ({
          name: s.name,
          color: s.color,
          data: timeseries.data.map(d => ({
            x: new Date(d.timestamp),
            y: s.valuePath(d.value) ?? null,
          })),
          type,
        })),
        step: timeseries.step,
      };
    },
    tooltipFormat: { y: FORMATTERS[formatter].tooltip },
    axisFormat: { y: FORMATTERS[formatter].axis },
    height,
    gridSize,
    strokeWidth,
    fillOpacity,
    pointSize,
    barBorderRadius,
    grouped,
  };
}

/**
 * Create a stacked bar chart configuration
 */
export function createStackedChart<T extends Record<string, any>, V = any>(config: {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  category: ChartCategory;
  queryHook: (vars: { from: string; to: string; step?: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => { data: Array<{ timestamp: string; value: V }>; step?: number };
  stacks: Array<{
    key: string;
    valuePath: (value: V) => number;
    color?: string;
  }>;
  formatter?: FormatterPreset;
  yAxisScale?: 'linear' | 'log';
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  barBorderRadius?: number;
}): ChartConfig<T> {
  const {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataPath,
    stacks,
    formatter = 'number',
    yAxisScale,
    height,
    gridSize,
    barBorderRadius,
  } = config;

  return {
    title,
    subtitle,
    primaryColor,
    category,
    queryHook,
    dataSelector: (data: T) => {
      const timeseries = dataPath(data);
      return {
        series: [
          {
            name: title,
            data: timeseries.data.map(d => ({
              x: new Date(d.timestamp),
              y: stacks.map(s => ({
                key: s.key,
                value: s.valuePath(d.value),
                color: s.color,
              })),
            })),
            type: 'bar' as const,
            stack: true as const,
          },
        ],
        step: timeseries.step,
      };
    },
    tooltipFormat: { y: FORMATTERS[formatter].tooltip },
    axisFormat: { y: FORMATTERS[formatter].axis },
    yAxisScale,
    height,
    gridSize,
    barBorderRadius,
  };
}

// ============================================================================
// Chart Configurations
// ============================================================================
//
// Each chart configuration is a single object containing:
//   - Data configuration (query, data path, formatters)
//   - Layout configuration (height, grid size)
//   - Visual styling (stroke width, opacity, etc.)
//
// Available options:
//   Layout:
//     - height: Chart height in pixels (default: 200)
//     - gridSize: Responsive grid sizes { xs, sm, md, lg, xl } (default: { xs: 12, md: 6 })
//
//   Data & Formatting:
//     - formatter: 'number' | 'compactNumber' | 'token' | 'percent' | 'bytes'
//     - type: 'line' | 'bar'
//
//   Visual Styling:
//     - strokeWidth: Line stroke width in pixels (default: 2)
//     - fillOpacity: Area fill opacity 0-1 (default: 0.25)
//     - pointSize: Point/glyph size in pixels (default: 10)
//     - barBorderRadius: Bar corner radius in pixels (default: 4)
//
// Examples:
//   - Full width chart: gridSize: { xs: 12 }
//   - Half width chart: gridSize: { xs: 12, md: 6 }
//   - Third width chart: gridSize: { xs: 12, md: 4 }
//   - Taller chart: height: 300
//   - Thicker lines: strokeWidth: 3
//   - More opaque fill: fillOpacity: 0.5

export const CHART_CONFIGS = {
  lockedValue: createSimpleChart({
    title: 'Locked Value',
    subtitle: 'Total value locked in the network',
    primaryColor: '#4A90E2',
    category: 'economics',
    queryHook: useLockedValueTimeseriesQuery,
    dataPath: data => data.lockedValueTimeseries,
    seriesName: 'TVL',
    formatter: 'token',
    valueTransform: v => fromSqd(v).toNumber(),
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  activeWorkers: createSimpleChart({
    title: 'Active Workers',
    subtitle: 'Number of workers actively processing queries',
    primaryColor: '#10B981',
    category: 'network',
    queryHook: useActiveWorkersTimeseriesQuery,
    dataPath: data => data.activeWorkersTimeseries,
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  reward: createStackedChart({
    title: 'Rewards',
    subtitle: 'Rewards distributed to workers and stakers',
    primaryColor: '#10B981',
    category: 'economics',
    queryHook: useRewardTimeseriesQuery,
    dataPath: data => data.rewardTimeseries,
    stacks: [
      {
        key: 'Worker Reward',
        valuePath: v => fromSqd(v?.workerReward).toNumber(),
        color: '#5B8FF9',
      },
      {
        key: 'Staker Reward',
        valuePath: v => fromSqd(v?.stakerReward).toNumber(),
        color: '#61CDBB',
      },
    ],
    formatter: 'token',
    barBorderRadius: 2,
    gridSize: { xs: 12, md: 6 },
  }),

  apr: createMultiSeriesChart({
    title: 'APR',
    subtitle: 'Annual percentage rate for workers and stakers',
    primaryColor: '#6B7280',
    category: 'economics',
    queryHook: useAprTimeseriesQuery,
    dataPath: data => data.aprTimeseries,
    series: [
      { name: 'Worker APR', valuePath: v => v?.workerApr, color: '#5B8FF9' },
      { name: 'Staker APR', valuePath: v => v?.stakerApr, color: '#61CDBB' },
    ],
    formatter: 'percent',
    strokeWidth: 2,
    fillOpacity: 0.25,
    gridSize: { xs: 12, md: 6 },
  }),

  uniqueOperators: createSimpleChart({
    title: 'Unique Operators',
    subtitle: 'Distinct operators running workers',
    primaryColor: '#8B5CF6',
    category: 'network',
    queryHook: useUniqueOperatorsTimeseriesQuery,
    dataPath: data => data.uniqueOperatorsTimeseries,
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  delegations: createSimpleChart({
    title: 'Delegations',
    subtitle: 'Total active delegation contracts',
    primaryColor: '#F59E0B',
    category: 'network',
    queryHook: useDelegationsTimeseriesQuery,
    dataPath: data => data.delegationsTimeseries,
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  uniqueDelegators: createSimpleChart({
    title: 'Unique Delegators',
    subtitle: 'Number of unique delegating accounts',
    primaryColor: '#06B6D4',
    category: 'network',
    queryHook: useDelegatorsTimeseriesQuery,
    dataPath: data => data.delegatorsTimeseries,
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  transfers: createStackedChart({
    title: 'Transfers',
    subtitle: 'Token transfer activity by type',
    primaryColor: '#6B7280',
    category: 'economics',
    queryHook: useTransfersByTypeTimeseriesQuery,
    dataPath: data => data.transfersByTypeTimeseries,
    stacks: [
      { key: 'Transfer', valuePath: v => v?.transfer ?? 0, color: '#4A90E2' },
      { key: 'Deposit', valuePath: v => v?.deposit ?? 0, color: '#10B981' },
      { key: 'Withdraw', valuePath: v => v?.withdraw ?? 0, color: '#F59E0B' },
      { key: 'Reward', valuePath: v => v?.reward ?? 0, color: '#8B5CF6' },
      { key: 'Release', valuePath: v => v?.release ?? 0, color: '#06B6D4' },
    ],
    formatter: 'number',
    barBorderRadius: 2,
  }),

  uniqueAccounts: createSimpleChart({
    title: 'Active Accounts',
    subtitle: 'Accounts with recent activity',
    primaryColor: '#06B6D4',
    category: 'usage',
    queryHook: useUniqueAccountsTimeseriesQuery,
    dataPath: data => data.uniqueAccountsTimeseries,
    seriesName: 'Unique Accounts',
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),

  queries: createSimpleChart({
    title: 'Queries Count',
    subtitle: 'Total queries processed',
    primaryColor: '#8B5CF6',
    category: 'usage',
    queryHook: useQueriesCountTimeseriesQuery,
    dataPath: data => data.queriesCountTimeseries,
    seriesName: 'Queries',
    type: 'line',
    formatter: 'number',
    strokeWidth: 2,
    fillOpacity: 0.3,
  }),

  servedData: createSimpleChart({
    title: 'Served Data',
    subtitle: 'Total data served to clients',
    primaryColor: '#F59E0B',
    category: 'usage',
    queryHook: useServedDataTimeseriesQuery,
    dataPath: data => data.servedDataTimeseries,
    type: 'line',
    formatter: 'bytes',
    strokeWidth: 2,
    fillOpacity: 0.3,
  }),

  storedData: createSimpleChart({
    title: 'Stored Data',
    subtitle: 'Total data stored in the network',
    primaryColor: '#4A90E2',
    category: 'usage',
    queryHook: useStoredDataTimeseriesQuery,
    dataPath: data => data.storedDataTimeseries,
    formatter: 'bytes',
    strokeWidth: 2,
    fillOpacity: 0.25,
  }),
} as const;

// ============================================================================
// Chart Layout Configuration
// ============================================================================

/** Default grid size for charts */
export const DEFAULT_GRID_SIZE = { xs: 12, md: 6 };

/** Array of chart configurations for dynamic rendering */
export const CHARTS = Object.entries(CHART_CONFIGS).map(([key, config]) => ({ key, config }));
