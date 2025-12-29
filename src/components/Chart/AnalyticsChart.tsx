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
import { CHART_CONFIG, toTimeRange, type ChartProps, type ChartSeries } from './';

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

interface TimeSeriesData<V = unknown> {
  data: Array<{ timestamp: string; value: number | V | null | undefined }>;
  step?: number;
  from?: string;
  to?: string;
}

interface SeriesConfig<V = unknown> {
  name: string;
  valuePath: (value: V) => number | null | undefined;
  color?: string;
}

interface StackConfig<V = unknown> {
  key: string;
  valuePath: (value: V) => number;
  color?: string;
}

export interface AnalyticsChartProps<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  primaryColor?: string;
  category?: string;
  range?: { from: Date; to: Date };
  step?: string;
  queryHook: (vars: { from: string; to: string; step?: string }) => {
    data: T | undefined;
    isLoading: boolean;
  };
  dataPath: (data: T) => TimeSeriesData<V>;
  tooltipFormat?: ChartProps['tooltipFormat'];
  axisFormat?: ChartProps['axisFormat'];
  yAxis?: { min?: number; max?: number };
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
  series?: SeriesConfig<V>[];
  grouped?: boolean;

  // Stacked chart fields
  stacks?: StackConfig<V>[];
}

function createColorPalette(primaryColor: string | undefined, defaultPalette: string[]): string[] {
  if (!primaryColor) return defaultPalette;

  return [
    primaryColor,
    lighten(primaryColor, 0.2),
    darken(primaryColor, 0.2),
    lighten(primaryColor, 0.4),
    darken(primaryColor, 0.4),
  ];
}

interface SeriesResult {
  name?: string;
  series: ChartSeries[];
  step?: number;
  from?: string;
  to?: string;
}

function buildStackedSeries<V>(
  timeseries: TimeSeriesData<V>,
  title: string | undefined,
  stacks: StackConfig<V>[],
): SeriesResult {
  return {
    series: [
      {
        name: title,
        type: 'bar' as const,
        stack: true as const,
        data: timeseries.data.map(d => ({
          x: new Date(d.timestamp),
          y: stacks.map(s => ({
            key: s.key,
            value: s.valuePath(d.value as V),
            color: s.color,
          })),
        })),
      },
    ],
    step: timeseries.step,
    from: timeseries.from,
    to: timeseries.to,
  };
}

function buildMultiSeries<V>(
  timeseries: TimeSeriesData<V>,
  seriesConfigs: SeriesConfig<V>[],
  type: 'line' | 'bar',
): SeriesResult {
  return {
    series: seriesConfigs.map(s => ({
      name: s.name,
      color: s.color,
      type,
      data: timeseries.data.map(d => ({
        x: new Date(d.timestamp),
        y: s.valuePath(d.value as V) ?? null,
      })),
    })),
    step: timeseries.step,
    from: timeseries.from,
    to: timeseries.to,
  };
}

function buildSimpleSeries(
  timeseries: TimeSeriesData<number>,
  seriesName: string | undefined,
  type: 'line' | 'bar',
  valueTransform: (v: number) => number,
): SeriesResult {
  return {
    series: [
      {
        name: seriesName,
        type,
        data: timeseries.data
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: valueTransform(d.value as number),
          })),
      },
    ],
    step: timeseries.step,
    from: timeseries.from,
    to: timeseries.to,
  };
}

function createSeries<T extends Record<string, unknown>, V>(
  props: AnalyticsChartProps<T, V>,
  data: T,
  title?: string,
): SeriesResult {
  const timeseries = props.dataPath(data);

  if (props.stacks) {
    return buildStackedSeries(timeseries, title, props.stacks);
  }

  if (props.series) {
    return buildMultiSeries(timeseries, props.series, props.type ?? 'line');
  }

  return buildSimpleSeries(
    timeseries as TimeSeriesData<number>,
    props.seriesName ?? title,
    props.type ?? 'line',
    props.valueTransform ?? (v => v),
  );
}

export function createSimpleChart<T extends Record<string, unknown> = Record<string, unknown>>(
  config: Omit<AnalyticsChartProps<T, number>, 'range' | 'step' | 'series' | 'stacks'>,
): Omit<AnalyticsChartProps<T, number>, 'range' | 'step'> {
  return config;
}

export function createMultiSeriesChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(
  config: Omit<
    AnalyticsChartProps<T, V>,
    'range' | 'step' | 'seriesName' | 'valueTransform' | 'stacks'
  > & {
    series: SeriesConfig<V>[];
  },
): Omit<AnalyticsChartProps<T, V>, 'range' | 'step'> {
  return config;
}

export function createStackedChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(
  config: Omit<
    AnalyticsChartProps<T, V>,
    'range' | 'step' | 'seriesName' | 'valueTransform' | 'series' | 'type' | 'grouped'
  > & {
    stacks: StackConfig<V>[];
  },
): Omit<AnalyticsChartProps<T, V>, 'range' | 'step'> {
  return config;
}

export function AnalyticsChart<
  T extends Record<string, unknown> = Record<string, unknown>,
  V = unknown,
>(props: AnalyticsChartProps<T, V>) {
  const {
    title,
    subtitle,
    action,
    primaryColor,
    range,
    queryHook,
    tooltipFormat,
    axisFormat,
    yAxis,
    step,
    height = CHART_CONFIG.height,
    strokeWidth,
    fillOpacity,
    barBorderRadius,
    grouped,
  } = props;

  const queryVars = useMemo(() => {
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

  const { series, stepMs, from, to } = useMemo(() => {
    if (!data) return { series: [], stepMs: undefined, from: new Date(0), to: new Date() };

    const result = createSeries(props, data, title);
    const palette = createGenerator(chartPalette);

    // Assign colors from palette to series without explicit colors
    const seriesWithColors = result.series.map(s => ({
      ...s,
      color: s.color ?? palette.next(),
    }));

    return {
      series: seriesWithColors,
      stepMs: result.step,
      from: new Date(result.from ?? 0),
      to: new Date(result.to ?? 0),
    };
  }, [data, props, chartPalette, title]);

  const hasData = series.some(s => s.data.length > 0);
  const showLegend = false;

  const tooltipFormatWithRange = useMemo(
    () => ({
      x: (d: Date) => toTimeRange(d, stepMs),
      ...tooltipFormat,
    }),
    [stepMs, tooltipFormat],
  );

  return (
    <Card title={title} subtitle={subtitle} action={action}>
      <Box display="flex" flexDirection="column">
        <Box height={height} display="flex" alignItems="center" justifyContent="center">
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={height} />
          ) : hasData ? (
            <LineChart
              series={series}
              tooltipFormat={tooltipFormatWithRange}
              axisFormat={axisFormat}
              xAxis={{ min: from, max: to }}
              yAxis={yAxis}
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
