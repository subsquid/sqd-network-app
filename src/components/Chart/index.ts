// ============================================================================
// Chart Components - Barrel Export
// ============================================================================

// Core chart components
export { LineChart, useChartPalette } from './LineChart';
export { ChartLegend } from './ChartLegend';
export { SharedCursorProvider, useSharedCursor } from './SharedCursorContext';

// High-level chart component and factory functions
export {
  AnalyticsChart,
  type AnalyticsChartProps,
  createSimpleChart,
  createMultiSeriesChart,
  createStackedChart,
  CHART_FORMATTERS,
} from './AnalyticsChart';

// Internal components (for advanced usage)
export { ChartTooltip } from './ChartTooltip';
export { CursorLines, CursorPoints } from './ChartCursor';
export { LineRenderer } from './LineRenderer';
export {
  BarRenderer,
  StackedBarRenderer,
  GroupedBarRenderer,
  calculateOptimalBarWidth,
} from './BarRenderer';
export { useTooltipHandler } from './useTooltipHandler';

// Types and utilities
export * from './types';
export * from './utils';
