/**
 * Single data point with optional nullable y-value
 * @template Nullable - When true, y can be null (for raw data). When false, y is required (for processed data).
 */
export interface ChartDatum<Nullable extends boolean = true> {
  x: Date;
  y: Nullable extends true ? number | null : number;
}

/**
 * Stacked data point with multiple y-values per x
 * @template Nullable - When true, values can be null. When false, values are required.
 */
export interface StackedChartDatum<Nullable extends boolean = true> {
  x: Date;
  y: Array<{
    key: string;
    value: Nullable extends true ? number | null : number;
    color?: string;
  }>;
}

/**
 * Base series configuration shared by all series types
 */
export interface ChartSeriesBase {
  name: string;
  type: 'line' | 'bar';
  color?: string;
}

/**
 * Single series (line or bar) with individual data points
 */
export interface SingleChartSeries<Nullable extends boolean = true> extends ChartSeriesBase {
  stack?: false;
  data: ChartDatum<Nullable>[];
}

/**
 * Stacked series where each data point contains multiple values
 */
export interface StackedChartSeries<Nullable extends boolean = true> extends ChartSeriesBase {
  stack: true;
  data: StackedChartDatum<Nullable>[];
}

/**
 * Union type for all chart series
 */
export type ChartSeries<Nullable extends boolean = true> =
  | SingleChartSeries<Nullable>
  | StackedChartSeries<Nullable>;

/**
 * Format functions for axis and tooltip display
 */
export interface ChartFormatters {
  x?: (x: Date) => string;
  y?: (y: number) => string;
}

/**
 * Axis range configuration
 */
export interface AxisRange<T> {
  min?: T;
  max?: T;
}

/**
 * Props for the main chart component
 */
export interface ChartProps {
  series: ChartSeries[];
  xAxis?: AxisRange<Date>;
  yAxis?: AxisRange<number>;
  tooltipFormat?: ChartFormatters;
  axisFormat?: ChartFormatters;
  // Visual styling
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
  grouped?: boolean;
}

/**
 * Chart configuration constants
 */
export const CHART_CONFIG = {
  height: 240,
  baseMargin: { top: 12, right: 20, bottom: 32, left: 32 },
  padding: {
    y: 0.1, // 10% padding for y-axis
    x: 0.02, // 2% padding for x-axis
  },
} as const;

export function isStackedSeries<N extends boolean>(
  series: ChartSeries<N>,
): series is StackedChartSeries<N> {
  return series.stack === true;
}

export function isSingleSeries<N extends boolean>(
  series: ChartSeries<N>,
): series is SingleChartSeries<N> {
  return !series.stack;
}

/** @deprecated Use ChartDatum instead */
export type SingleLineChartDatum<N extends boolean = true> = ChartDatum<N>;

/** @deprecated Use StackedChartDatum instead */
export type StackedLineChartDatum<N extends boolean = true> = StackedChartDatum<N>;

/** @deprecated Use SingleChartSeries instead */
export type SingleLineChartSeries<N extends boolean = true> = SingleChartSeries<N>;

/** @deprecated Use StackedChartSeries instead */
export type StackedLineChartSeries<N extends boolean = true> = StackedChartSeries<N>;

/** @deprecated Use ChartSeries instead */
export type LineChartSeries<N extends boolean = true> = ChartSeries<N>;

/** @deprecated Use ChartDatum instead */
export type LineChartDatum<N extends boolean = true> = ChartDatum<N> | StackedChartDatum<N>;

/** @deprecated Use ChartSeriesBase instead */
export type LineChartSeriesBase = ChartSeriesBase;

/** @deprecated Use ChartProps instead */
export type LineChartProps = ChartProps;
