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
import { partition } from 'lodash-es';
import {
  CHART_CONFIG,
  type LineChartProps,
  type LineChartSeries,
  type SingleLineChartDatum,
  type SingleLineChartSeries,
  type StackedLineChartSeries,
} from './types';
import { useSharedCursor } from './SharedCursorContext';
import { LineRenderer } from './LineRenderer';
import {
  BarRenderer,
  GroupedBarRenderer,
  StackedBarRenderer,
  calculateOptimalBarWidth,
} from './BarRenderer';
import { ChartTooltip } from './ChartTooltip';
import { CursorLines, CursorPoints } from './ChartCursor';
import { useTooltipHandler } from './useTooltipHandler';

// ============================================================================
// Chart Hooks
// ============================================================================

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

    // Ensure Y-axis never goes below 0
    minY = Math.max(minY, 0);

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
    const maxYValue = Math.max(
      ...yTicks.map(d => (axisFormat?.y ? (axisFormat.y(d)?.length ?? 0) : String(d).length)),
    );

    const leftMargin = maxYValue * 7 + 8 + 6;

    return {
      top: CHART_CONFIG.baseMargin.top,
      right: CHART_CONFIG.baseMargin.right,
      bottom: CHART_CONFIG.baseMargin.bottom,
      left: Math.max(leftMargin, CHART_CONFIG.baseMargin.left),
    };
  }, [yTicks, axisFormat]);
}

// ============================================================================
// Chart Series Component
// ============================================================================

interface ChartSeriesProps {
  series: LineChartSeries[];
  xScale: any;
  yScale: any;
  palette: string[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  tooltipFormat?: LineChartProps['tooltipFormat'];
  strokeWidth: number;
  fillOpacity: number;
  pointSize: number;
  barBorderRadius: number;
  grouped: boolean;
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
  strokeWidth,
  fillOpacity,
  barBorderRadius,
  grouped,
}: ChartSeriesProps) {
  const theme = useTheme();

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<Record<string, SingleLineChartDatum<false>>>();

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

  if (width <= 0) return null;

  const [stackedSeries, unstackedSeries] = partition(series, s => s.stack) as [
    StackedLineChartSeries[],
    SingleLineChartSeries[],
  ];

  // Calculate bar width based on the first available series
  const referenceData = stackedSeries[0]?.data || unstackedSeries[0]?.data || [];
  const barWidth = calculateOptimalBarWidth(referenceData, width, xScale);

  return (
    <g ref={tooltipContainerRef}>
      {/* Render stacked bars */}
      {stackedSeries.map(s => {
        if (s.type !== 'bar') return null;
        return (
          <StackedBarRenderer
            key={s.name}
            series={s}
            xScale={xScale}
            yScale={yScale}
            palette={palette}
            barWidth={barWidth}
            barBorderRadius={barBorderRadius}
          />
        );
      })}

      {/* Render grouped or individual unstacked series */}
      {grouped && unstackedSeries.some(s => s.type === 'bar') ? (
        <GroupedBarRenderer
          barSeries={unstackedSeries.filter(s => s.type === 'bar')}
          xScale={xScale}
          yScale={yScale}
          palette={palette}
          barWidth={barWidth}
          barBorderRadius={barBorderRadius}
        />
      ) : (
        unstackedSeries.map((s, i) => {
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

      {/* Tooltip points */}
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

      {/* Interaction rect */}
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

// ============================================================================
// Line Chart Component
// ============================================================================

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
  margin: marginOverride,
}: LineChartProps) {
  const theme = useTheme();
  const palette = useChartPalette();
  const domain = useChartDomain(series);
  const { xScale, yScale } = useChartScales(series, xAxis || domain.x, yAxis || domain.y);

  const autoMargin = useAutoMargin(xScale.ticks(), yScale.ticks(), axisFormat);
  const margin = {
    ...autoMargin,
    ...marginOverride,
  };

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
