import { useMemo } from 'react';
import { Card } from '@components/Card';
import { Box, Skeleton, Typography } from '@mui/material';
import { lighten, darken } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { createGenerator } from '@lib/array';
import { toUTCDate } from '@lib/datemath';
import {
  bytesFormatter,
  percentFormatter,
  toCompact,
  tokenFormatter,
  toNumber,
} from '@lib/formatters/formatters';
import { LineChart, useChartPalette } from './LineChart';
import { ChartLegend } from './ChartLegend';
import { CHART_CONFIG, toTimeRange, type LineChartProps, type LineChartSeries } from './';

// ============================================================================
// Common Formatters
// ============================================================================

export const CHART_FORMATTERS = {
  number: {
    tooltip: (d: number) => toNumber.format(d),
    axis: (d: number) => toCompact.format(d),
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

// ============================================================================
// Analytics Chart Props Types
// ============================================================================

export interface AnalyticsChartProps<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
> {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  category?: string;
  range?: { from: Date; to: Date };
  step?: string;
  queryHook: (vars: { from: string; to: string; step?: string }) => {
    data: T | undefined;
    isLoading: boolean;
  };
  dataPath: (data: T) => {
    data: Array<{ timestamp: string; value: number | V | null | undefined }>;
    step?: number;
  };
  tooltipFormat?: LineChartProps['tooltipFormat'];
  axisFormat?: LineChartProps['axisFormat'];
  yAxisScale?: 'linear' | 'log';
  height?: number;
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;

  // Simple chart fields
  seriesName?: string;
  type?: 'line' | 'bar';
  valueTransform?: (value: number) => number;

  // Multi-series chart fields
  series?: Array<{
    name: string;
    valuePath: (value: V) => number | null | undefined;
    color?: string;
  }>;
  grouped?: boolean;

  // Stacked chart fields
  stacks?: Array<{
    key: string;
    valuePath: (value: V) => number;
    color?: string;
  }>;
}

// ============================================================================
// Helper Functions
// ============================================================================

function createColorPalette(primaryColor: string | undefined, defaultPalette: string[]) {
  if (!primaryColor) return defaultPalette;

  return [
    primaryColor,
    lighten(primaryColor, 0.2),
    darken(primaryColor, 0.2),
    lighten(primaryColor, 0.4),
    darken(primaryColor, 0.4),
  ];
}

function createSeries<T extends Record<string, unknown> = Record<string, unknown>, V = unknown>(
  props: AnalyticsChartProps<T, V>,
  data: T,
  title: string,
): {
  series: LineChartSeries[];
  step?: number;
} {
  const timeseries = props.dataPath(data);

  // Stacked chart
  if (props.stacks) {
    return {
      series: [
        {
          name: title,
          data: timeseries.data.map(d => ({
            x: new Date(d.timestamp),
            y: props.stacks!.map(s => ({
              key: s.key,
              value: s.valuePath(d.value as V),
              color: s.color,
            })),
          })),
          type: 'bar' as const,
          stack: true as const,
        },
      ],
      step: timeseries.step,
    };
  }

  // Multi-series chart
  if (props.series) {
    const type = props.type || 'line';
    return {
      series: props.series.map(s => ({
        name: s.name,
        color: s.color,
        data: timeseries.data.map(d => ({
          x: new Date(d.timestamp),
          y: s.valuePath(d.value as V) ?? null,
        })),
        type,
      })),
      step: timeseries.step,
    };
  }

  // Simple chart
  const seriesName = props.seriesName || title;
  const type = props.type || 'line';
  const valueTransform = props.valueTransform || ((v: number) => v);

  return {
    series: [
      {
        name: seriesName,
        data: timeseries.data
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value != null ? valueTransform(d.value as number) : null,
          })),
        type,
      },
    ],
    step: timeseries.step,
  };
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a simple single-series chart configuration
 */
export function createSimpleChart<T extends Record<string, unknown> = Record<string, unknown>>(
  config: Omit<AnalyticsChartProps<T, number>, 'range' | 'step' | 'series' | 'stacks'>,
): Omit<AnalyticsChartProps<T, number>, 'range' | 'step'> {
  return config;
}

/**
 * Creates a multi-series chart configuration
 */
export function createMultiSeriesChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(
  config: Omit<
    AnalyticsChartProps<T, V>,
    'range' | 'step' | 'seriesName' | 'valueTransform' | 'stacks'
  > & {
    series: Array<{
      name: string;
      valuePath: (value: V) => number | null | undefined;
      color?: string;
    }>;
  },
): Omit<AnalyticsChartProps<T, V>, 'range' | 'step'> {
  return config;
}

/**
 * Creates a stacked bar chart configuration
 */
export function createStackedChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(
  config: Omit<
    AnalyticsChartProps<T, V>,
    'range' | 'step' | 'seriesName' | 'valueTransform' | 'series' | 'type' | 'grouped'
  > & {
    stacks: Array<{
      key: string;
      valuePath: (value: V) => number;
      color?: string;
    }>;
  },
): Omit<AnalyticsChartProps<T, V>, 'range' | 'step'> {
  return config;
}

// ============================================================================
// Analytics Chart Component
// ============================================================================

/**
 * Universal chart component that handles simple, multi-series, and stacked charts
 */
export function AnalyticsChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(props: AnalyticsChartProps<T, V>) {
  const {
    title,
    subtitle,
    primaryColor,
    range,
    queryHook,
    tooltipFormat,
    axisFormat,
    step,
    height = CHART_CONFIG.height,
    strokeWidth,
    fillOpacity,
    pointSize,
    barBorderRadius,
    grouped,
  } = props;

  const queryVars = useMemo(() => {
    // If no range provided, use a very wide range to fetch all data
    const from = range?.from ? toUTCDate(range.from) : new Date(0);
    const to = range?.to ? toUTCDate(range.to) : new Date();
    
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      step: !step || step === 'auto' ? undefined : step,
    };
  }, [range, step]);

  const { data, isLoading } = queryHook(queryVars);
  const defaultPalette = useChartPalette();

  const chartPalette = useMemo(
    () => createColorPalette(primaryColor, defaultPalette),
    [primaryColor, defaultPalette],
  );

  const { series, stepMs } = useMemo(() => {
    if (!data) return { series: [], stepMs: undefined };

    const result = createSeries(props, data, title);
    const palette = createGenerator(chartPalette);

    // Assign colors from palette to series that don't have colors
    const seriesWithColors = result.series.map(s => ({
      ...s,
      color: s.color || palette.next(),
    }));

    return {
      series: seriesWithColors,
      stepMs: result.step,
    };
  }, [data, props, chartPalette, title]);

  const hasData = series.some(s => s.data.length > 0);
  const showLegend = false;

  return (
    <Card title={title} subtitle={subtitle}>
      <Box display="flex" flexDirection="column">
        <Box height={height} display="flex" alignItems="center" justifyContent="center">
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={height} />
          ) : hasData ? (
            <LineChart
              series={series}
              tooltipFormat={{
                x: (d: Date) => toTimeRange(d, stepMs),
                ...tooltipFormat,
              }}
              axisFormat={axisFormat}
              strokeWidth={strokeWidth}
              fillOpacity={fillOpacity}
              pointSize={0}
              barBorderRadius={barBorderRadius}
              grouped={grouped}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ShowChartIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom fontWeight={500}>
                No data available
              </Typography>
              <Typography variant="body2" color="text.disabled" fontSize={13}>
                Data will appear once collected for the selected time range
              </Typography>
            </Box>
          )}
        </Box>
        {showLegend && hasData && !isLoading && (
          <ChartLegend series={series} palette={chartPalette} />
        )}
      </Box>
    </Card>
  );
}
