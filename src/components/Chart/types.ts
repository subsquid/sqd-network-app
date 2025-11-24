// ============================================================================
// Chart Types
// ============================================================================

export type SingleLineChartDatum<N = true> = {
  x: Date;
  y: N extends true ? number | null : number;
};

export interface SingleLineChartSeries<T = true> extends LineChartSeriesBase {
  stack?: false;
  data: SingleLineChartDatum<T>[];
}

export interface StackedLineChartDatum<T = true> {
  x: Date;
  y: { key: string; value: T extends true ? number | null : number; color?: string }[];
}

export interface StackedLineChartSeries<T = true> extends LineChartSeriesBase {
  stack: true;
  data: StackedLineChartDatum<T>[];
}

export interface LineChartSeriesBase {
  stack?: boolean;
  type: 'line' | 'bar';
  name: string;
  color?: string;
}

export type LineChartSeries<T = true> = SingleLineChartSeries<T> | StackedLineChartSeries<T>;

export type LineChartDatum<T = true> = SingleLineChartDatum<T> | StackedLineChartDatum<T>;

export interface LineChartProps {
  series: LineChartSeries[];
  xAxis?: { min?: Date; max?: Date };
  yAxis?: { min?: number; max?: number };
  tooltipFormat?: {
    x?: (x: Date) => string;
    y?: (y: number) => string;
  };
  axisFormat?: {
    x?: (x: Date) => string;
    y?: (y: number) => string;
  };
  stack?: boolean;
  // Visual styling
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
  grouped?: boolean;
}

// Chart configuration
export const CHART_CONFIG = {
  height: 240,
  // Base margins - will be automatically calculated
  baseMargin: { top: 12, right: 20, bottom: 32, left: 32 },
  padding: {
    y: 0.1, // 10% padding for y-axis
    x: 0.02, // 2% padding for x-axis - ensures proper spacing
  },
} as const;

