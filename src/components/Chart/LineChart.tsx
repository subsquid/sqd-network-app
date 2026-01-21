import { useCallback, useMemo } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import {
  defaultStyles as tooltipDefaultStyles,
  useTooltip,
  useTooltipInPortal,
} from '@visx/tooltip';

import {
  BarRenderer,
  GroupedBarRenderer,
  StackedBarRenderer,
  calculateOptimalBarWidth,
} from './BarRenderer';
import { CursorLines, CursorPoints } from './ChartCursor';
import { ChartTooltip } from './ChartTooltip';
import { LineRenderer } from './LineRenderer';
import { useSharedCursor } from './SharedCursorContext';
import {
  CHART_CONFIG,
  type ChartDatum,
  type ChartFormatters,
  type ChartProps,
  type ChartSeries,
  type SingleChartSeries,
  type StackedChartSeries,
  isSingleSeries,
  isStackedSeries,
} from './types';
import { useTooltipHandler } from './useTooltipHandler';

export function useChartPalette() {
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

interface AxisRange<T> {
  min?: T;
  max?: T;
}

function useChartScales(series: ChartSeries[], xAxis?: AxisRange<Date>, yAxis?: AxisRange<number>) {
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
      xAxis?.min?.getTime() ?? Math.min(...allX),
      xAxis?.max?.getTime() ?? Math.max(...allX),
      CHART_CONFIG.padding.x,
    );

    return scaleTime<number>({ domain: [minX, maxX] });
  }, [series, xAxis, calculatePadding]);

  const yScale = useMemo(() => {
    const allY = series.flatMap(s =>
      isStackedSeries(s)
        ? s.data.map(d => d.y.reduce((acc, { value }) => acc + (value ?? 0), 0))
        : s.data.map(d => d.y).filter((y): y is number => y != null),
    );

    let [minY, maxY] = calculatePadding(
      yAxis?.min ?? Math.min(...allY),
      yAxis?.max ?? Math.max(...allY),
      CHART_CONFIG.padding.y,
    );

    // Ensure Y-axis never goes below 0
    minY = Math.max(minY, 0);

    return scaleLinear<number>({ domain: [minY, maxY] });
  }, [series, yAxis, calculatePadding]);

  return { xScale, yScale };
}

function useChartDomain(series: ChartSeries[]) {
  return useMemo(() => {
    if (series.length === 0) return { x: undefined, y: undefined };

    const allY = series.flatMap(s =>
      isStackedSeries(s)
        ? s.data.map(d => d.y.reduce((acc, { value }) => acc + (value ?? 0), 0))
        : s.data.map(d => d.y),
    );
    const allX = series.flatMap(s => s.data.map(d => d.x?.getTime() ?? 0));

    return {
      x: { min: new Date(Math.min(...allX)), max: new Date(Math.max(...allX)) },
      y: {
        min: Math.min(...allY.filter((y): y is number => y != null)),
        max: Math.max(...allY.filter((y): y is number => y != null)),
      },
    };
  }, [series]);
}

function useAutoMargin(yTicks: number[], axisFormat?: ChartFormatters) {
  return useMemo(() => {
    const maxYLabelLength = Math.max(
      ...yTicks.map(d => (axisFormat?.y ? axisFormat.y(d).length : String(d).length)),
    );

    const leftMargin = maxYLabelLength * 7 + 14;

    return {
      top: CHART_CONFIG.baseMargin.top,
      right: CHART_CONFIG.baseMargin.right,
      bottom: CHART_CONFIG.baseMargin.bottom,
      left: Math.max(leftMargin, CHART_CONFIG.baseMargin.left),
    };
  }, [yTicks, axisFormat]);
}

interface PartitionedSeries {
  stacked: StackedChartSeries[];
  single: SingleChartSeries[];
  barSeries: SingleChartSeries[];
  lineSeries: SingleChartSeries[];
}

function partitionSeries(series: ChartSeries[]): PartitionedSeries {
  const stacked: StackedChartSeries[] = [];
  const single: SingleChartSeries[] = [];

  for (const s of series) {
    if (isStackedSeries(s)) {
      stacked.push(s);
    } else if (isSingleSeries(s)) {
      single.push(s);
    }
  }

  return {
    stacked,
    single,
    barSeries: single.filter(s => s.type === 'bar'),
    lineSeries: single.filter(s => s.type === 'line'),
  };
}

interface ChartSeriesRendererProps {
  series: ChartSeries[];
  xScale: ReturnType<typeof scaleTime<number>>;
  yScale: ReturnType<typeof scaleLinear<number>>;
  palette: string[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  tooltipFormat?: ChartFormatters;
  strokeWidth: number;
  fillOpacity: number;
  barBorderRadius: number;
  grouped: boolean;
}

function ChartSeriesRenderer({
  series,
  xScale,
  yScale,
  palette,
  width,
  height,
  margin,
  tooltipFormat,
  strokeWidth,
  fillOpacity,
  barBorderRadius,
  grouped,
}: ChartSeriesRendererProps) {
  const theme = useTheme();

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<Record<string, ChartDatum<false>>>();

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const { cursor, setCursor } = useSharedCursor({
    shared: true,
    width,
    height,
  });

  const handleTooltip = useTooltipHandler({
    series,
    xScale,
    margin,
    showTooltip,
    setCursor,
  });

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
    setCursor(null);
  }, [hideTooltip, setCursor]);

  const partitioned = useMemo(() => partitionSeries(series), [series]);

  const barWidth = useMemo(() => {
    const referenceData = partitioned.stacked[0]?.data ?? partitioned.single[0]?.data ?? [];
    return calculateOptimalBarWidth(referenceData, width, xScale);
  }, [partitioned, width, xScale]);

  if (width <= 0) return null;

  return (
    <g ref={tooltipContainerRef}>
      {/* Stacked bars */}
      {partitioned.stacked.map(s =>
        s.type === 'bar' ? (
          <StackedBarRenderer
            key={s.name}
            series={s}
            xScale={xScale}
            yScale={yScale}
            palette={palette}
            barWidth={barWidth}
            barBorderRadius={barBorderRadius}
          />
        ) : null,
      )}

      {/* Single series - grouped or individual */}
      {grouped && partitioned.barSeries.length > 0 ? (
        <GroupedBarRenderer
          barSeries={partitioned.barSeries}
          xScale={xScale}
          yScale={yScale}
          palette={palette}
          barWidth={barWidth}
          barBorderRadius={barBorderRadius}
        />
      ) : (
        partitioned.single.map((s, i) => {
          const color = s.color ?? palette[i % palette.length];

          if (s.type === 'line') {
            return (
              <LineRenderer
                key={s.name}
                series={s}
                xScale={xScale}
                yScale={yScale}
                color={color}
                strokeWidth={strokeWidth}
                fillOpacity={fillOpacity}
              />
            );
          }

          if (s.type === 'bar') {
            return (
              <BarRenderer
                key={s.name}
                series={s}
                xScale={xScale}
                yScale={yScale}
                color={color}
                barWidth={barWidth}
                barBorderRadius={barBorderRadius}
              />
            );
          }

          return null;
        })
      )}

      {/* Cursor lines */}
      {cursor && <CursorLines x={cursor.x} y={cursor.y} width={width} height={height} />}

      {/* Tooltip cursor points */}
      {tooltipOpen && (
        <CursorPoints
          series={series}
          tooltipData={tooltipData}
          xScale={xScale}
          yScale={yScale}
          palette={palette}
          cursor={cursor}
        />
      )}

      {/* Interaction overlay */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        onTouchStart={handleTooltip}
        onTouchMove={handleTooltip}
        onMouseMove={handleTooltip}
        onMouseLeave={handleMouseLeave}
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

export function LineChart({
  series,
  axisFormat,
  tooltipFormat,
  xAxis,
  yAxis,
  strokeWidth = 2,
  fillOpacity = 0.25,
  pointSize = 10,
  barBorderRadius = 4,
  grouped = false,
}: ChartProps) {
  const theme = useTheme();
  const palette = useChartPalette();
  const domain = useChartDomain(series);
  const { xScale, yScale } = useChartScales(series, xAxis ?? domain.x, yAxis ?? domain.y);

  const margin = useAutoMargin(yScale.ticks(), axisFormat);

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
                  tickFormat={axisFormat?.y as Parameters<typeof AxisLeft>[0]['tickFormat']}
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

                <ChartSeriesRenderer
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
