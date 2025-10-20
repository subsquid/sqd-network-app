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
  useHoldersCountTimeseriesQuery,
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

export interface ChartConfig<T> {
  title: string;
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataSelector: (data: T) => LineChartSeries[] | null | undefined;
  tooltipFormat?: LineChartProps['tooltipFormat'];
  axisFormat?: LineChartProps['axisFormat'];
  // Layout configuration
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  // Visual styling
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
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
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => Array<{ timestamp: string; value: number | null | undefined }>;
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
    queryHook,
    dataSelector: (data: T) => [
      {
        name: seriesName,
        data: dataPath(data)
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value != null ? valueTransform(d.value) : null,
          })),
        type,
      },
    ],
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
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => Array<{ timestamp: string; value: V }>;
  series: Array<{
    name: string;
    valuePath: (value: V) => number | null | undefined;
  }>;
  type?: 'line' | 'bar';
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
    queryHook,
    dataPath,
    series,
    type = 'line',
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
    queryHook,
    dataSelector: (data: T) =>
      series.map(s => ({
        name: s.name,
        data: dataPath(data).map(d => ({
          x: new Date(d.timestamp),
          y: s.valuePath(d.value) ?? null,
        })),
        type,
      })),
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
 * Create a stacked bar chart configuration
 */
export function createStackedChart<T extends Record<string, any>, V = any>(config: {
  title: string;
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataPath: (data: T) => Array<{ timestamp: string; value: V }>;
  stacks: Array<{
    key: string;
    valuePath: (value: V) => number;
  }>;
  formatter?: FormatterPreset;
  height?: number;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  barBorderRadius?: number;
}): ChartConfig<T> {
  const {
    title,
    queryHook,
    dataPath,
    stacks,
    formatter = 'number',
    height,
    gridSize,
    barBorderRadius,
  } = config;

  return {
    title,
    queryHook,
    dataSelector: (data: T) => [
      {
        name: title,
        data: dataPath(data).map(d => ({
          x: new Date(d.timestamp),
          y: stacks.map(s => ({
            key: s.key,
            value: s.valuePath(d.value),
          })),
        })),
        type: 'bar' as const,
        stack: true as const,
      },
    ],
    tooltipFormat: { y: FORMATTERS[formatter].tooltip },
    axisFormat: { y: FORMATTERS[formatter].axis },
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
  holders: createSimpleChart({
    title: 'Holders',
    queryHook: useHoldersCountTimeseriesQuery,
    dataPath: data => data.holdersCountTimeseries,
    formatter: 'compactNumber',
  }),

  lockedValue: createSimpleChart({
    title: 'Locked Value',
    queryHook: useLockedValueTimeseriesQuery,
    dataPath: data => data.lockedValueTimeseries,
    seriesName: 'TVL',
    formatter: 'token',
    valueTransform: v => fromSqd(v).toNumber(),
    // Example: custom styling options
    // height: 300,              // Taller chart
    // gridSize: { xs: 12 },     // Full width
    // strokeWidth: 3,           // Thicker line
    // fillOpacity: 0.4,         // More opaque fill
    // pointSize: 15,            // Larger data points
  }),

  activeWorkers: createSimpleChart({
    title: 'Active Workers',
    queryHook: useActiveWorkersTimeseriesQuery,
    dataPath: data => data.activeWorkersTimeseries,
  }),

  uniqueOperators: createSimpleChart({
    title: 'Unique Operators',
    queryHook: useUniqueOperatorsTimeseriesQuery,
    dataPath: data => data.uniqueOperatorsTimeseries,
  }),

  delegations: createSimpleChart({
    title: 'Delegations',
    queryHook: useDelegationsTimeseriesQuery,
    dataPath: data => data.delegationsTimeseries,
  }),

  uniqueDelegators: createSimpleChart({
    title: 'Unique Delegators',
    queryHook: useDelegatorsTimeseriesQuery,
    dataPath: data => data.delegatorsTimeseries,
  }),

  apr: createMultiSeriesChart({
    title: 'APR',
    queryHook: useAprTimeseriesQuery,
    dataPath: data => data.aprTimeseries,
    series: [
      { name: 'Worker APR', valuePath: v => v?.workerApr },
      { name: 'Staker APR', valuePath: v => v?.stakerApr },
    ],
    formatter: 'percent',
  }),

  reward: createStackedChart({
    title: 'Reward',
    queryHook: useRewardTimeseriesQuery,
    dataPath: data => data.rewardTimeseries,
    stacks: [
      { key: 'Worker reward', valuePath: v => fromSqd(v?.workerReward).toNumber() },
      { key: 'Staker reward', valuePath: v => fromSqd(v?.stakerReward).toNumber() },
    ],
    formatter: 'token',
  }),

  transfers: createStackedChart({
    title: 'Transfers',
    queryHook: useTransfersByTypeTimeseriesQuery,
    dataPath: data => data.transfersByTypeTimeseries,
    stacks: [
      { key: 'Transfer', valuePath: v => v?.transfer ?? 0 },
      { key: 'Deposit', valuePath: v => v?.deposit ?? 0 },
      { key: 'Withdraw', valuePath: v => v?.withdraw ?? 0 },
      { key: 'Reward', valuePath: v => v?.reward ?? 0 },
      { key: 'Release', valuePath: v => v?.release ?? 0 },
    ],
  }),

  uniqueAccounts: createSimpleChart({
    title: 'Active Accounts',
    queryHook: useUniqueAccountsTimeseriesQuery,
    dataPath: data => data.uniqueAccountsTimeseries,
    seriesName: 'Unique Accounts',
  }),

  queries: createSimpleChart({
    title: 'Queries Count',
    queryHook: useQueriesCountTimeseriesQuery,
    dataPath: data => data.queriesCountTimeseries,
    seriesName: 'Queries',
    type: 'bar',
  }),

  servedData: createSimpleChart({
    title: 'Served Data',
    queryHook: useServedDataTimeseriesQuery,
    dataPath: data => data.servedDataTimeseries,
    type: 'bar',
    formatter: 'bytes',
  }),

  storedData: createSimpleChart({
    title: 'Stored Data',
    queryHook: useStoredDataTimeseriesQuery,
    dataPath: data => data.storedDataTimeseries,
    formatter: 'bytes',
  }),
} as const;

// ============================================================================
// Chart Layout Configuration
// ============================================================================

/** Default grid size for charts */
export const DEFAULT_GRID_SIZE = { xs: 12, md: 6 };

/** Array of chart configurations for dynamic rendering */
export const CHARTS = Object.entries(CHART_CONFIGS).map(([key, config]) => ({ key, config }));

