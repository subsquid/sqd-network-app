import React, { useCallback, useMemo, useState, createContext, useContext, useEffect } from 'react';

// Components
import { Card } from '@components/Card';
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { SquaredChip } from '@components/Chip';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Line, LinePath, Bar } from '@visx/shape';
import { GlyphCircle } from '@visx/glyph';
import {
  useTooltip,
  useTooltipInPortal,
  defaultStyles as tooltipDefaultStyles,
} from '@visx/tooltip';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { Group } from '@visx/group';
import {
  HoldersCountTimeseriesQuery,
  LockedValueTimeseriesQuery,
  ActiveWorkersTimeseriesQuery,
  useActiveWorkersTimeseriesQuery,
  useAprTimeseriesQuery,
  DelegationsTimeseriesQuery,
  useDelegationsTimeseriesQuery,
  DelegatorsTimeseriesQuery,
  useDelegatorsTimeseriesQuery,
  useHoldersCountTimeseriesQuery,
  useLockedValueTimeseriesQuery,
  useUniqueOperatorsTimeseriesQuery,
  UniqueOperatorsTimeseriesQuery,
  AprTimeseriesQuery,
  useRewardTimeseriesQuery,
  RewardTimeseriesQuery,
  useTransfersByTypeTimeseriesQuery,
  TransfersByTypeTimeseriesQuery,
  useUniqueAccountsTimeseriesQuery,
  UniqueAccountsTimeseriesQuery,
  useQueriesCountTimeseriesQuery,
  QueriesCountTimeseriesQuery,
  useServedDataTimeseriesQuery,
  ServedDataTimeseriesQuery,
  useStoredDataTimeseriesQuery,
  StoredDataTimeseriesQuery,
} from '@api/subsquid-network-squid';
import { Loader } from '@components/Loader';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { fromSqd } from '@lib/network';
import { TimeRangePicker } from '@components/Form';
import { useLocationState, Location } from '@hooks/useLocationState';
import {
  bytesFormatter,
  percentFormatter,
  tokenFormatter,
  toCompact,
  toDate,
  toNumber,
} from '@lib/formatters/formatters';
import { parseTimeRange } from '@lib/datemath';
import { partition } from 'lodash-es';

const CHART_CONFIG = {
  height: 200,
  // Base margins - will be automatically calculated
  baseMargin: { top: 8, right: 16, bottom: 24, left: 24 },
  padding: {
    y: 0.1, // 10% padding for y-axis
    x: 0.025, // 2% padding for x-axis
  },
} as const;

export type SingleLineChartDatum<N = true> = {
  x: Date;
  y: N extends true ? number | null : number;
};

export interface SingleLineChartSeries<T = true> extends LineChartSeriesBase {
  stack?: false;
  data: SingleLineChartDatum<T>[];
  color?: string;
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
}

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
          seriesColorMap.set(item.key, palette[stackIndex % palette.length]);
        });
      }
    } else {
      seriesColorMap.set(s.name, palette[i % palette.length]);
    }
  });

  return (
    <Paper variant="outlined">
      {firstDatum && (
        <>
          <Typography variant="body2">
            {tooltipFormat?.x ? tooltipFormat.x(firstDatum.x) : toDate.format(firstDatum.x)}
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
}: {
  series: LineChartSeries[];
  xScale: any;
  yScale: any;
  palette: string[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  tooltipFormat?: LineChartProps['tooltipFormat'];
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

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const point = localPoint(event);
      if (!point) return;

      const groupRelativeX = point.x - margin.left;
      const groupRelativeY = point.y - margin.top;

      setCursor({
        x: groupRelativeX,
        y: groupRelativeY,
        isVisible: true,
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
    [showTooltip, series, xScale, bisectDate, margin, setCursor, width, height],
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

        const barWidth = Math.max((Math.max(0, width) / Math.max(1, series.data.length)) * 0.6, 1);

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
                rx={4}
              />
            );
          });
        });

        return barSegments;
      })}
      {unstacked.map((s, i) => {
        const color = s.color ?? palette[i % palette.length];

        const data = s.data.filter(d => d.y != null);

        switch (s.type) {
          case 'line':
            return (
              <g key={s.name}>
                <LinePath<SingleLineChartDatum>
                  data={data}
                  x={d => xScale(d.x)}
                  y={d => yScale(d.y)}
                  stroke={color}
                  strokeWidth={4}
                />
                {data.length <= 50 &&
                  data.map(d => (
                    <GlyphCircle
                      key={`${s.name}-${d.x?.getTime() ?? 0}`}
                      left={xScale(d.x)}
                      top={yScale(d.y)}
                      size={40}
                      fill={color}
                    />
                  ))}
              </g>
            );
          case 'bar':
            return (
              <Group key={s.name}>
                {data.map(d => {
                  if (d.y == null) return null;
                  const barWidth = Math.max(
                    (Math.max(0, width) / Math.max(1, s.data.length)) * 0.6,
                    1,
                  );
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
                      rx={4}
                    />
                  );
                })}
              </Group>
            );
          default:
            return null;
        }
      })}

      {/* Shared crosshairs from context */}
      {cursor?.isVisible && (
        <Group>
          <Line
            from={{ x: cursor.x, y: 0 }} // Convert relative back to pixels
            to={{ x: cursor.x, y: height }}
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            pointerEvents="none"
            strokeDasharray="4,4"
          />
          <Line
            from={{ x: 0, y: cursor.y }} // Convert relative back to pixels
            to={{ x: width, y: cursor.y }}
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            pointerEvents="none"
            strokeDasharray="4,4"
          />
        </Group>
      )}

      {tooltipOpen && (
        <Group>
          {series.map((s: LineChartSeries, i: number) => {
            if (s.type === 'bar') return null;

            if (s.stack) {
              const stackedSeries = s as StackedLineChartSeries;
              const x0 = cursor ? xScale.invert(cursor.x * width) : 0;
              const index = bisectDate(stackedSeries.data, x0, 1);
              const d0 = stackedSeries.data[index - 1];
              const d1 = stackedSeries.data[index];
              let d = d0;
              if (d1) {
                d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
              }

              let offsetY = d.y.reduce((acc, { value }) => acc + (value ?? 0), 0);
              return d.y.map(({ key, value }, stackIndex) => {
                if (value == null || !tooltipData?.[key]) return null;

                const segmentCenterY = offsetY - value / 2;
                offsetY -= value;

                const color = palette[stackIndex % palette.length];
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
              const color = palette[i % palette.length];
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

function LineChart({ series, axisFormat, tooltipFormat, xAxis, yAxis, stack }: LineChartProps) {
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
                  stroke={theme.palette.divider}
                  strokeWidth={2}
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
                  stroke={theme.palette.divider}
                  strokeWidth={2}
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
                />
              </Group>
            </svg>
          </Box>
        );
      }}
    </ParentSize>
  );
}

interface ChartConfig<T> {
  title: string;
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataSelector: (data: T) => LineChartSeries[] | null | undefined;
  tooltipFormat?: LineChartProps['tooltipFormat'];
  axisFormat?: LineChartProps['axisFormat'];
}

interface CursorState {
  x: number;
  y: number;
  isVisible: boolean;
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
}: { shared?: boolean; width: number; height: number }) {
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
                isVisible: cursor.isVisible,
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
            isVisible: context.cursor.isVisible,
          }
        : null,
    );
  }, [width, height, shared, context]);

  return {
    cursor: cursorState
      ? {
          x: cursorState.x,
          y: cursorState.y,
          isVisible: cursorState.isVisible,
        }
      : null,
    setCursor,
  };
}

function AnalyticsChart<T>({
  title,
  range,
  queryHook,
  dataSelector,
  tooltipFormat,
  axisFormat,
  step,
}: {
  range: { from: Date; to: Date };
  step?: string;
} & ChartConfig<T>) {
  const queryVars = useMemo(
    () => ({
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      step: !step || step === 'auto' ? undefined : step,
    }),
    [range, step],
  );

  const { data, isLoading } = queryHook(queryVars);
  const palette = createGenerator(useChartPalette());

  const series: LineChartSeries[] = useMemo(() => {
    const timeseriesData = data ? dataSelector(data) : null;
    if (!timeseriesData) return [];

    return timeseriesData.map(s => ({
      ...s,
      color: palette.next(),
    }));
  }, [data, dataSelector, palette]);

  const hasData = series.some(s => s.data.length > 0);

  return (
    <Card title={<SquaredChip label={title} color="primary" />}>
      <Box height={CHART_CONFIG.height} display="flex" alignItems="center" justifyContent="center">
        {isLoading ? (
          <Loader />
        ) : hasData ? (
          <LineChart
            series={series}
            tooltipFormat={{
              x: (d: Date) => toDate.format(d),
              ...tooltipFormat,
            }}
            axisFormat={axisFormat}
            xAxis={{ min: range.from, max: range.to }}
          />
        ) : (
          <Typography variant="body1">No data</Typography>
        )}
      </Box>
    </Card>
  );
}

const CHART_CONFIGS = {
  holders: {
    title: 'Holders',
    queryHook: useHoldersCountTimeseriesQuery,
    dataSelector: (data: HoldersCountTimeseriesQuery) => [
      {
        name: 'Holders',
        data: data.holdersCountTimeseries
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value ?? null,
          })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => new Intl.NumberFormat('en-US').format(d),
    },
    axisFormat: {
      y: (d: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(d),
    },
  },
  lockedValue: {
    title: 'Locked Value',
    queryHook: useLockedValueTimeseriesQuery,
    dataSelector: (data: LockedValueTimeseriesQuery) => [
      {
        name: 'TVL',
        data: data.lockedValueTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value != null ? fromSqd(d.value).toNumber() : null,
        })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => tokenFormatter(d, 'SQD'),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  activeWorkers: {
    title: 'Active Workers',
    queryHook: useActiveWorkersTimeseriesQuery,
    dataSelector: (data: ActiveWorkersTimeseriesQuery) => [
      {
        name: 'Active Workers',
        data: data.activeWorkersTimeseries
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value ?? null,
          })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  uniqueOperators: {
    title: 'Unique Operators',
    queryHook: useUniqueOperatorsTimeseriesQuery,
    dataSelector: (data: UniqueOperatorsTimeseriesQuery) => [
      {
        name: 'Unique Operators',
        data: data.uniqueOperatorsTimeseries
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value ?? null,
          })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  delegations: {
    title: 'Delegations',
    queryHook: useDelegationsTimeseriesQuery,
    dataSelector: (data: DelegationsTimeseriesQuery) => [
      {
        name: 'Delegations',
        data: data.delegationsTimeseries
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value ?? null,
          })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  uniqueDelegators: {
    title: 'Unique Delegators',
    queryHook: useDelegatorsTimeseriesQuery,
    dataSelector: (data: DelegatorsTimeseriesQuery) => [
      {
        name: 'Unique Delegators',
        data: data.delegatorsTimeseries
          .filter(d => d.value != null)
          .map(d => ({
            x: new Date(d.timestamp),
            y: d.value ?? null,
          })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  apr: {
    title: 'APR',
    queryHook: useAprTimeseriesQuery,
    dataSelector: (data: AprTimeseriesQuery) => [
      {
        name: 'Worker APR',
        data: data.aprTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value?.workerApr ?? null,
        })),
        type: 'line' as const,
      },
      {
        name: 'Staker APR',
        data: data.aprTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value?.stakerApr ?? null,
        })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => percentFormatter(d),
    },
    axisFormat: {
      y: (d: number) => percentFormatter(d, 0),
    },
  },
  reward: {
    title: 'Reward',
    queryHook: useRewardTimeseriesQuery,
    dataSelector: (data: RewardTimeseriesQuery) => {
      return [
        {
          name: 'Stacked Rewards',
          data: data.rewardTimeseries.map(d => ({
            x: new Date(d.timestamp),
            y: [
              {
                key: 'Worker reward',
                value: fromSqd(d.value?.workerReward).toNumber(),
              },
              {
                key: 'Staker reward',
                value: fromSqd(d.value?.stakerReward).toNumber(),
              },
            ],
          })),
          type: 'bar' as const,
          stack: true as const,
        },
      ];
    },
    tooltipFormat: {
      y: (d: number) => tokenFormatter(d, 'SQD'),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  transfers: {
    title: 'Transfers',
    queryHook: useTransfersByTypeTimeseriesQuery,
    dataSelector: (data: TransfersByTypeTimeseriesQuery) => [
      {
        name: 'Transfers',
        data: data.transfersByTypeTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value
            ? [
                {
                  key: 'Transfer',
                  value: d.value.transfer,
                },
                {
                  key: 'Deposit',
                  value: d.value.deposit,
                },
                {
                  key: 'Withdraw',
                  value: d.value.withdraw,
                },
                {
                  key: 'Reward',
                  value: d.value.reward,
                },
                {
                  key: 'Release',
                  value: d.value.release,
                },
              ]
            : [],
        })),
        type: 'bar' as const,
        stack: true as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  uniqueAccounts: {
    title: 'Active Accounts',
    queryHook: useUniqueAccountsTimeseriesQuery,
    dataSelector: (data: UniqueAccountsTimeseriesQuery) => [
      {
        name: 'Unique Accounts',
        data: data.uniqueAccountsTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value ?? null,
        })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  queries: {
    title: 'Queries Count',
    queryHook: useQueriesCountTimeseriesQuery,
    dataSelector: (data: QueriesCountTimeseriesQuery) => [
      {
        name: 'Queries',
        data: data.queriesCountTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value ?? null,
        })),
        type: 'bar' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => toNumber.format(d),
    },
    axisFormat: {
      y: (d: number) => toCompact.format(d),
    },
  },
  servedData: {
    title: 'Served Data',
    queryHook: useServedDataTimeseriesQuery,
    dataSelector: (data: ServedDataTimeseriesQuery) => [
      {
        name: 'Served Data',
        data: data.servedDataTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value ?? null,
        })),
        type: 'bar' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => bytesFormatter(d),
    },
    axisFormat: {
      y: (d: number) => bytesFormatter(d, true),
    },
  },
  storedData: {
    title: 'Stored Data',
    queryHook: useStoredDataTimeseriesQuery,
    dataSelector: (data: StoredDataTimeseriesQuery) => [
      {
        name: 'Stored Data',
        data: data.storedDataTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value ?? null,
        })),
        type: 'line' as const,
      },
    ],
    tooltipFormat: {
      y: (d: number) => bytesFormatter(d),
    },
    axisFormat: {
      y: (d: number) => bytesFormatter(d, true),
    },
  },
} as const;

export function Analytics() {
  const [state, setState] = useLocationState({
    from: new Location.String(''),
    to: new Location.String(''),
    step: new Location.String('auto'),
  });

  const rangeRaw = useMemo(() => {
    return {
      start: state.from || 'now-90d',
      end: state.to || 'now',
    };
  }, [state.from, state.to]);

  const range = useMemo(() => {
    return parseTimeRange(rangeRaw.start, rangeRaw.end);
  }, [rangeRaw]);

  return (
    <CenteredPageWrapper className="wide">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1}>
          <Box width={160}>
            <TimeRangePicker
              value={rangeRaw}
              onChange={range => {
                setState.from(range.start);
                setState.to(range.end);
              }}
            />
          </Box>
          <Box>
            <Select
              value={state.step}
              onChange={e => setState.step(e.target.value)}
              variant="filled"
              color="secondary"
            >
              {['auto', '1h', '3h', '6h', '12h', '1d', '3d', '1w', '2w', '1M', '3M', '6M'].map(
                step => {
                  return (
                    <MenuItem key={step} value={step}>
                      {step}
                    </MenuItem>
                  );
                },
              )}
            </Select>
          </Box>
        </Stack>
      </Box>
      <SharedCursorProvider>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.holders} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.lockedValue} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.activeWorkers} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueOperators} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.delegations} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueDelegators} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.apr} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.reward} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.transfers} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueAccounts} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.queries} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.servedData} step={state.step} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsChart range={range} {...CHART_CONFIGS.storedData} step={state.step} />
          </Grid>
        </Grid>
      </SharedCursorProvider>
    </CenteredPageWrapper>
  );
}
