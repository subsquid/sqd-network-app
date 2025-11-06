import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Location, useLocationState } from '@hooks/useLocationState';
import { parseTimeRange } from '@lib/datemath';
import { toDateDay, toDateSeconds } from '@lib/formatters/formatters';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GlyphCircle } from '@visx/glyph';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape';
import {
  defaultStyles as tooltipDefaultStyles,
  useTooltip,
  useTooltipInPortal,
} from '@visx/tooltip';
import { curveMonotoneX } from '@visx/curve';
import { bisector } from 'd3-array';
import { addMilliseconds } from 'date-fns';
import { partition } from 'lodash-es';
import { CHARTS, DEFAULT_GRID_SIZE, type ChartConfig } from './chartConfigs';

const CHART_CONFIG = {
  height: 240,
  // Base margins - will be automatically calculated
  baseMargin: { top: 12, right: 20, bottom: 32, left: 32 },
  padding: {
    y: 0.1, // 10% padding for y-axis
    x: 0.02, // 2% padding for x-axis - ensures proper spacing
  },
} as const;

// ============================================================================
// Types - Exported for use in chartConfigs.ts
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

// ============================================================================
// Chart Internals
// ============================================================================

function useChartPalette() {
  const theme = useTheme();
  return useMemo(
    () => [
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.secondary.main,
    ],
    [theme],
  );
}

function createGenerator<T>(v: T[]) {
  let i = -1;

  return {
    next() {
      i = (i + 1) % v.length;
      return v[i];
    },
  };
}

function useChartScales(
  series: LineChartSeries[],
  xAxis?: { min?: Date; max?: Date },
  yAxis?: { min?: number; max?: number },
) {
  const calculatePadding = useCallback((min: number, max: number, padding: number) => {
    if (min === max) {
      const defaultPadding = Math.abs(max * padding) || 1;
      return [min - defaultPadding, max + defaultPadding];
    }
    const range = max - min;
    const paddingAmount = range * padding;
    return [
      min >= 0 ? Math.max(min - paddingAmount, 0) : min - paddingAmount,
      max <= 0 ? Math.min(max + paddingAmount, 0) : max + paddingAmount,
    ];
  }, []);

  const xScale = useMemo(() => {
    const allX = series.flatMap(s => s.data.map(d => d.x.getTime()));

    const [minX, maxX] = calculatePadding(
      xAxis?.min?.getTime() || Math.min(...allX),
      xAxis?.max?.getTime() || Math.max(...allX),
      CHART_CONFIG.padding.x,
    );

    return scaleTime<number>({
      domain: [minX, maxX],
    });
  }, [series, xAxis, calculatePadding]);

  const yScale = useMemo(() => {
    const allY = series.flatMap(s =>
      s.stack
        ? s.data.map(d => d.y.reduce((acc, { value }) => acc + (value ?? 0), 0))
        : s.data.map(d => d.y).filter(y => y != null),
    );

    let [minY, maxY] = calculatePadding(
      yAxis?.min ?? Math.min(...allY),
      yAxis?.max ?? Math.max(...allY),
      CHART_CONFIG.padding.y,
    );

    if (series.some((s: LineChartSeries) => s.type === 'bar')) {
      minY = Math.min(minY, 0);
    }

    return scaleLinear<number>({
      domain: [minY, maxY],
    });
  }, [series, yAxis, calculatePadding]);

  return { xScale, yScale };
}

function useChartDomain(series: LineChartSeries[]) {
  return useMemo(() => {
    if (series.length === 0) return { x: undefined, y: undefined };

    const allY = series.flatMap(s =>
      s.stack
        ? s.data.map(d => d.y.reduce((acc, { value }) => acc + (value ?? 0), 0))
        : s.data.map(d => d.y),
    );
    const allX = series.flatMap(s => s.data.map(d => d.x?.getTime() ?? 0));

    return {
      x: { min: new Date(Math.min(...allX)), max: new Date(Math.max(...allX)) },
      y: {
        min: Math.min(...allY.filter(y => y != null)),
        max: Math.max(...allY.filter(y => y != null)),
      },
    };
  }, [series]);
}

function useAutoMargin(
  xTicks: Date[],
  yTicks: number[],
  axisFormat?: LineChartProps['axisFormat'],
) {
  return useMemo(() => {
    // Calculate left margin based on Y-axis label width
    const maxYValue = Math.max(
      ...yTicks.map(d => (axisFormat?.y ? (axisFormat.y(d)?.length ?? 0) : String(d).length)),
    );

    // Rough estimation: 1 character ≈ 7px for 11px font
    const leftMargin = maxYValue * 7 + 8 + 6;

    return {
      top: CHART_CONFIG.baseMargin.top,
      right: CHART_CONFIG.baseMargin.right,
      bottom: CHART_CONFIG.baseMargin.bottom,
      left: Math.max(leftMargin, CHART_CONFIG.baseMargin.left),
    };
  }, [yTicks, axisFormat]);
}

function ChartTooltip({
  tooltipData,
  series,
  palette,
  tooltipFormat,
}: {
  tooltipData: Record<string, SingleLineChartDatum<false>>;
  series: LineChartSeries[];
  palette: string[];
  tooltipFormat?: LineChartProps['tooltipFormat'];
}) {
  const firstDatum = Object.values(tooltipData)[0];

  // Create a map of series names to colors for quick lookup
  const seriesColorMap = new Map<string, string>();

  series.forEach((s, i) => {
    if (s.stack) {
      // For stacked series, we need to map each stack item key to a color
      const stackedSeries = s as StackedLineChartSeries;
      if (stackedSeries.data.length > 0) {
        stackedSeries.data[0].y.forEach((item, stackIndex) => {
          seriesColorMap.set(item.key, item.color ?? palette[stackIndex % palette.length]);
        });
      }
    } else {
      // Use series.color if available, fallback to palette
      seriesColorMap.set(s.name, s.color ?? palette[i % palette.length]);
    }
  });

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      {firstDatum && (
        <>
          <Typography variant="body2">
            {tooltipFormat?.x ? tooltipFormat.x(firstDatum.x) : toDateSeconds.format(firstDatum.x)}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
        </>
      )}
      {Object.entries(tooltipData).map(([key, datum]) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: 160,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: seriesColorMap.get(key) || palette[0],
              }}
            />
            <Typography variant="body2">{key}</Typography>
          </Box>
          <Typography variant="body2">
            {tooltipFormat?.y && datum.y != null ? tooltipFormat.y(datum.y) : String(datum.y || '')}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

function ChartSeries({
  series,
  xScale,
  yScale,
  palette,
  width,
  height,
  margin,
  tooltipFormat,
  step,
  strokeWidth = 2,
  fillOpacity = 0.25,
  pointSize = 10,
  barBorderRadius = 4,
  grouped = false,
}: {
  series: LineChartSeries[];
  xScale: any;
  yScale: any;
  palette: string[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  tooltipFormat?: LineChartProps['tooltipFormat'];
  step?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  pointSize?: number;
  barBorderRadius?: number;
  grouped?: boolean;
}) {
  const theme = useTheme();

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<Record<string, SingleLineChartDatum<false>>>();

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const bisectDate = useMemo(() => bisector<{ x: Date }, Date>(d => d.x).left, []);

  const { cursor, setCursor } = useSharedCursor({
    shared: true,
    width,
    height,
  });

  const calculateOptimalBarWidth = useCallback(
    (data: { x: Date }[]) => {
      if (data.length < 2) return Math.min(width * 0.1, 40); // Fallback for single point

      const [minTime, maxTime] = xScale.domain();
      const timeRangeMs = maxTime - minTime;

      const sortedData = [...data].sort((a, b) => a.x.getTime() - b.x.getTime());
      const intervals = [];
      for (let i = 1; i < sortedData.length; i++) {
        intervals.push(sortedData[i].x.getTime() - sortedData[i - 1].x.getTime());
      }
      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

      const expectedDataPoints = Math.max(timeRangeMs / avgInterval, data.length);

      const calculatedWidth = (width / expectedDataPoints) * 0.5;
      return calculatedWidth;
    },
    [width, xScale],
  );

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const point = localPoint(event);
      if (!point) return;

      const groupRelativeX = point.x - margin.left;
      const groupRelativeY = point.y - margin.top;

      setCursor({
        x: groupRelativeX,
        y: groupRelativeY,
      });

      const x0 = xScale.invert(groupRelativeX);
      const tooltipData: Record<string, SingleLineChartDatum<false>> = {};

      for (const s of series) {
        if (s.stack) {
          // Handle stacked series - show individual stack items
          const stackedSeries = s as StackedLineChartSeries;
          const index = bisectDate(stackedSeries.data, x0, 1);
          const d0 = stackedSeries.data[index - 1];
          const d1 = stackedSeries.data[index];
          let d = d0;
          if (d1) {
            d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
          }

          for (const y of d.y) {
            if (y.value != null) {
              tooltipData[y.key] = { x: d.x, y: y.value };
            }
          }
        } else {
          // Handle single series
          const singleSeries = s as SingleLineChartSeries;
          const index = bisectDate(singleSeries.data, x0, 1);
          const d0 = singleSeries.data[index - 1];
          const d1 = singleSeries.data[index];
          let d = d0;
          if (d1) {
            d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
          }
          if (d.y == null) continue;
          tooltipData[s.name] = { x: d.x, y: d.y };
        }
      }

      const firstDatum = Object.values(tooltipData)[0];
      if (firstDatum) {
        showTooltip({
          tooltipData,
          tooltipLeft: point.x - margin.left,
          tooltipTop: point.y - margin.top,
        });
      }
    },
    [showTooltip, series, xScale, bisectDate, margin, setCursor],
  );

  if (width <= 0) return null;

  const [stacked, unstacked] = partition(series, s => s.stack) as [
    StackedLineChartSeries[],
    SingleLineChartSeries[],
  ];

  return (
    <g ref={tooltipContainerRef}>
      {stacked.map(series => {
        if (series.type !== 'bar') return null;

        const barWidth = calculateOptimalBarWidth(series.data);

        const barSegments = series.data.flatMap(d => {
          const x = d.x;
          const barX = Math.max(0, xScale(x) - barWidth / 2);

          let offsetY = d.y.reduce((acc, { value }) => acc + (value ?? 0), 0);
          return d.y.map(({ key, color, value }, i) => {
            if (value == null) return null;

            const barY = yScale(offsetY);
            const barHeight = Math.max(0, yScale.range()[0] - barY);
            offsetY -= value;

            return (
              <Bar
                key={`${key}-${d.x.getTime()}`}
                x={barX}
                y={barY}
                height={barHeight}
                width={barWidth}
                fill={color ?? palette[i % palette.length]}
                rx={barBorderRadius}
              />
            );
          });
        });

        return barSegments;
      })}
      {grouped && unstacked.some(s => s.type === 'bar')
        ? // Grouped bars rendering
          (() => {
            const barSeries = unstacked.filter(s => s.type === 'bar');
            if (barSeries.length === 0) return null;

            const referenceData = barSeries[0].data.filter(d => d.y != null);
            const barWidth = calculateOptimalBarWidth(referenceData);
            const groupWidth = barWidth * 0.9;
            const individualBarWidth = groupWidth / barSeries.length;

            return barSeries.map((s, seriesIndex) => {
              const color = s.color ?? palette[seriesIndex % palette.length];
              const data = s.data.filter(d => d.y != null);

              return (
                <Group key={s.name}>
                  {data.map(d => {
                    if (d.y == null) return null;
                    const barHeight = Math.max(0, yScale.range()[0] - yScale(d.y));
                    const barY = yScale(Math.max(0, d.y));
                    const groupX = xScale(d.x) - groupWidth / 2;
                    const barX = Math.max(0, groupX + seriesIndex * individualBarWidth);

                    return (
                      <Bar
                        key={`${s.name}-${d.x?.getTime() ?? 0}`}
                        x={barX}
                        y={barY}
                        height={barHeight}
                        width={individualBarWidth}
                        fill={color}
                        rx={barBorderRadius}
                      />
                    );
                  })}
                </Group>
              );
            });
          })()
        : unstacked.map((s, i) => {
            const color = s.color ?? palette[i % palette.length];

            const data = s.data.filter(d => d.y != null);
            const gradientId = `gradient-${s.name.replace(/\s+/g, '-')}-${i}`;

            switch (s.type) {
              case 'line':
                return (
                  <g key={s.name}>
                    <defs>
                      <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.5} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <AreaClosed<SingleLineChartDatum>
                      data={data}
                      x={d => xScale(d.x)}
                      y={d => yScale(d.y)}
                      yScale={yScale}
                      fill={`url(#${gradientId})`}
                      curve={curveMonotoneX}
                    />
                    <LinePath<SingleLineChartDatum>
                      data={data}
                      x={d => xScale(d.x)}
                      y={d => yScale(d.y)}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      curve={curveMonotoneX}
                    />
                  </g>
                );
              case 'bar':
                const barWidth = calculateOptimalBarWidth(data);
                return (
                  <Group key={s.name}>
                    {data.map(d => {
                      if (d.y == null) return null;
                      const barHeight = Math.max(0, yScale.range()[0] - yScale(d.y));
                      const barY = yScale(Math.max(0, d.y));
                      const barX = Math.max(0, xScale(d.x) - barWidth / 2);
                      return (
                        <Bar
                          key={`${s.name}-${d.x?.getTime() ?? 0}`}
                          x={barX}
                          y={barY}
                          height={barHeight}
                          width={barWidth}
                          fill={color}
                          rx={barBorderRadius}
                        />
                      );
                    })}
                  </Group>
                );
              default:
                return null;
            }
          })}

      {cursor && (
        <Group>
          <Line
            from={{ x: cursor.x, y: 0 }} // Convert relative back to pixels
            to={{ x: cursor.x, y: height }}
            stroke={theme.palette.secondary.main}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="4,4"
            opacity={0.6}
          />
          <Line
            from={{ x: 0, y: cursor.y }} // Convert relative back to pixels
            to={{ x: width, y: cursor.y }}
            stroke={theme.palette.secondary.main}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="4,4"
            opacity={0.6}
          />
        </Group>
      )}

      {tooltipOpen && (
        <Group>
          {series.map((s: LineChartSeries, i: number) => {
            if (s.type === 'bar') return null;

            if (s.stack) {
              const stackedSeries = s as StackedLineChartSeries;
              const x0 = cursor ? xScale.invert(cursor.x) : 0;
              const index = bisectDate(stackedSeries.data, x0, 1);
              const d0 = stackedSeries.data[index - 1];
              const d1 = stackedSeries.data[index];
              let d = d0;
              if (d1) {
                d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
              }

              let offsetY = d.y.reduce((acc, { value }) => acc + (value ?? 0), 0);
              return d.y.map(({ key, value, color: itemColor }, stackIndex) => {
                if (value == null || !tooltipData?.[key]) return null;

                const segmentCenterY = offsetY - value / 2;
                offsetY -= value;

                const color = itemColor ?? palette[stackIndex % palette.length];
                return (
                  <GlyphCircle
                    key={`${key}-tooltip-glyph`}
                    left={xScale(d.x)}
                    top={yScale(segmentCenterY)}
                    size={64}
                    fill={color}
                    pointerEvents="none"
                  />
                );
              });
            } else {
              const datum = tooltipData?.[s.name];
              if (!datum) return null;
              const color = s.color ?? palette[i % palette.length];
              return (
                <GlyphCircle
                  key={`${s.name}-tooltip-glyph`}
                  left={xScale(datum.x)}
                  top={yScale(datum.y)}
                  size={64}
                  fill={color}
                  pointerEvents="none"
                />
              );
            }
          })}
        </Group>
      )}

      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        onTouchStart={handleTooltip}
        onTouchMove={handleTooltip}
        onMouseMove={handleTooltip}
        onMouseLeave={() => {
          hideTooltip();
          setCursor(null);
        }}
      />

      {/* Tooltip portal */}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...tooltipDefaultStyles,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
            padding: '0.5rem',
          }}
          unstyled
          applyPositionStyle
        >
          <ChartTooltip
            tooltipData={tooltipData}
            series={series}
            palette={palette}
            tooltipFormat={tooltipFormat}
          />
        </TooltipInPortal>
      )}
    </g>
  );
}

function LineChart({
  series,
  axisFormat,
  tooltipFormat,
  xAxis,
  yAxis,
  stack,
  strokeWidth = 2,
  fillOpacity = 0.25,
  pointSize = 10,
  barBorderRadius = 4,
  grouped = false,
}: LineChartProps) {
  const theme = useTheme();
  const palette = useChartPalette();
  const domain = useChartDomain(series);
  const { xScale, yScale } = useChartScales(series, xAxis || domain.x, yAxis || domain.y);

  const margin = useAutoMargin(xScale.ticks(), yScale.ticks(), axisFormat);

  return (
    <ParentSize>
      {({ width, height }: { width: number; height: number }) => {
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        xScale.range([0, xMax]);
        yScale.range([yMax, 0]);

        if (width <= 0 || height <= 0 || xMax <= 0 || yMax <= 0) {
          return <Typography variant="body2">Chart area too small</Typography>;
        }

        return (
          <Box>
            <svg width={width} height={height}>
              <Group left={margin.left} top={margin.top}>
                <AxisBottom
                  scale={xScale}
                  top={yMax}
                  numTicks={5}
                  stroke="transparent"
                  strokeWidth={1}
                  tickStroke={theme.palette.divider}
                  tickLabelProps={() => ({
                    fill: theme.palette.text.secondary,
                    fontSize: 11,
                    textAnchor: 'middle',
                  })}
                />
                <AxisLeft
                  scale={yScale}
                  numTicks={5}
                  tickFormat={axisFormat?.y as any}
                  stroke="transparent"
                  strokeWidth={1}
                  tickStroke={theme.palette.divider}
                  tickLabelProps={() => ({
                    fill: theme.palette.text.secondary,
                    fontSize: 11,
                    textAnchor: 'end',
                    dy: '0.33em',
                    dx: '-0.33em',
                  })}
                />

                <ChartSeries
                  series={series}
                  xScale={xScale}
                  yScale={yScale}
                  palette={palette}
                  width={xMax}
                  height={yMax}
                  margin={margin}
                  tooltipFormat={tooltipFormat}
                  strokeWidth={strokeWidth}
                  fillOpacity={fillOpacity}
                  pointSize={pointSize}
                  barBorderRadius={barBorderRadius}
                  grouped={grouped}
                />
              </Group>
            </svg>
          </Box>
        );
      }}
    </ParentSize>
  );
}

// ============================================================================
// Shared Cursor for synchronized chart interactions
// ============================================================================

interface CursorState {
  x: number;
  y: number;
}

const SharedCursorContext = createContext<{
  cursor: CursorState | null;
  setSharedCursor: (cursor: CursorState | null) => void;
} | null>(null);

function SharedCursorProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setSharedCursor] = useState<CursorState | null>(null);

  return (
    <SharedCursorContext.Provider value={{ cursor, setSharedCursor }}>
      {children}
    </SharedCursorContext.Provider>
  );
}

function useSharedCursor({
  shared,
  width,
  height,
}: {
  shared?: boolean;
  width: number;
  height: number;
}) {
  const context = useContext(SharedCursorContext);
  if (shared && !context) {
    throw new Error('shared cursor must be used within a SharedCursorProvider');
  }

  const [cursorState, setCursorState] = useState<CursorState | null>(null);

  const setCursor = useCallback(
    (cursor: CursorState | null) => {
      setCursorState(cursor);
      if (width <= 0 || height <= 0) return;
      if (shared) {
        context?.setSharedCursor?.(
          cursor
            ? {
                x: cursor.x / width,
                y: cursor.y / height,
              }
            : null,
        );
      }
    },
    [shared, context, width, height],
  );

  useEffect(() => {
    if (!shared) return;
    setCursorState(
      context?.cursor
        ? {
            x: context.cursor.x * width,
            y: context.cursor.y * height,
          }
        : null,
    );
  }, [width, height, shared, context]);

  return {
    cursor: cursorState
      ? {
          x: cursorState.x,
          y: cursorState.y,
        }
      : null,
    setCursor,
  };
}

// Helper to convert local date to UTC by removing timezone offset
function toUTCDate(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}

function toTimeRange(date: Date, stepMs?: number) {
  if (!stepMs) return toDateSeconds.format(date);

  const from = date;
  const to = addMilliseconds(date, stepMs - 1);

  if (stepMs >= 24 * 60 * 60 * 1000) {
    return (toDateDay as any).formatRange(from, to);
  }

  return (toDateSeconds as any).formatRange(from, to);
}

function AnalyticsChart<T>({
  title,
  subtitle,
  primaryColor,
  range,
  queryHook,
  dataSelector,
  tooltipFormat,
  axisFormat,
  step,
  height = CHART_CONFIG.height,
  strokeWidth,
  fillOpacity,
  pointSize,
  barBorderRadius,
  grouped,
}: {
  range: { from: Date; to: Date };
  step?: string;
} & ChartConfig<T>) {
  const queryVars = useMemo(
    () => ({
      from: toUTCDate(range.from).toISOString(),
      to: toUTCDate(range.to).toISOString(),
      step: !step || step === 'auto' ? undefined : step,
    }),
    [range, step],
  );

  const { data, isLoading } = queryHook(queryVars);
  const defaultPalette = useChartPalette();

  // Create harmonious color palette based on primary color
  const chartPalette = useMemo(() => {
    if (!primaryColor) return defaultPalette;

    // For multi-series charts, create variations of the primary color
    // For single series, just use the primary color
    return [
      primaryColor,
      adjustColorBrightness(primaryColor, 20),
      adjustColorBrightness(primaryColor, -20),
      adjustColorBrightness(primaryColor, 40),
      adjustColorBrightness(primaryColor, -40),
    ];
  }, [primaryColor, defaultPalette]);

  const palette = createGenerator(chartPalette);

  const { series, step: stepMs }: { series: LineChartSeries[]; step?: number } = useMemo(() => {
    const result = data ? dataSelector(data) : null;

    return {
      series:
        result?.series.map(s => ({
          ...s,
          color: s.color || palette.next(),
        })) || [],
      step: result?.step,
    };
  }, [data, dataSelector, palette]);

  const hasData = series.some(s => s.data.length > 0);
  const showLegend = series.length > 1 && title !== 'APR';

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

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  const adjust = (value: number) => {
    const adjusted = value + (value * percent) / 100;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// ============================================================================
// Chart Legend Component
// ============================================================================

function ChartLegend({ series, palette }: { series: LineChartSeries[]; palette: string[] }) {
  const items = series.map((s, i) => ({
    name: s.name,
    color: s.color ?? palette[i % palette.length],
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2.5,
        justifyContent: 'center',
        mt: 2.5,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {items.map(item => (
        <Box key={item.name} display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.5,
              bgcolor: item.color,
            }}
          />
          <Typography variant="caption" color="text.secondary" fontSize={11}>
            {item.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

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

// FIXME: probably bad for performance
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
    return CHARTS.filter(({ config }) => config.category === state.category);
  }, [state.category]);

  return (
    <>
      <Box
        sx={{
          mb: 2,
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
          {filteredCharts.map(({ key, config }) => (
            <Grid key={key} size={config.gridSize || DEFAULT_GRID_SIZE}>
              <AnalyticsChart range={range} {...config} step={state.step} />
            </Grid>
          ))}
        </Grid>
      </SharedCursorProvider>
    </>
  );
}
