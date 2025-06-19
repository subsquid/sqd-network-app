import React, { useCallback, useMemo, useState } from 'react';

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
// Visx XYChart primitives
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Line, Bar, LinePath } from '@visx/shape';
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
import { subDays } from 'date-fns';
import { Loader } from '@components/Loader';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { fromSqd } from '@lib/network';
import { TimeRangePicker } from '@components/Form';
import { useLocationState, Location } from '@hooks/useLocationState';
import { groupBy } from 'lodash-es';
import {
  bytesFormatter,
  percentFormatter,
  tokenFormatter,
  toCompact,
  toDate,
  toNumber,
} from '@lib/formatters/formatters';
import { parseTimeRange } from '@lib/datemath';

// ---------------------------------------------------------------------------
// Constants and Types

const CHART_CONFIG = {
  height: 200,
  // Base margins - will be automatically calculated
  baseMargin: { top: 8, right: 16, bottom: 24, left: 24 },
  padding: {
    y: 0.1, // 10% padding for y-axis
    x: 0.025, // 2% padding for x-axis
  },
} as const;

export type LineChartDatum = {
  x: Date;
  y: number;
};

export interface LineChartSeries {
  name: string;
  color?: string;
  data: LineChartDatum[];
  type: 'line' | 'bar';
}

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
}

// ---------------------------------------------------------------------------
// Hooks

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

function useChartScales(
  series: LineChartSeries[],
  xAxis?: { min?: Date; max?: Date },
  yAxis?: { min?: number; max?: number },
) {
  const xScale = useMemo(() => {
    const allX = series.flatMap(s => s.data.map(d => d.x.getTime()));
    const minX = xAxis?.min?.getTime() || Math.min(...allX);
    const maxX = xAxis?.max?.getTime() || Math.max(...allX);

    return scaleTime<number>({
      domain: [minX, maxX],
    });
  }, [series, xAxis]);

  const yScale = useMemo(() => {
    const allY = series.flatMap(s => s.data.map(d => d.y));
    const minY = yAxis?.min ?? Math.min(...allY);
    const maxY = yAxis?.max ?? Math.max(...allY);

    return scaleLinear<number>({
      domain: [minY, maxY],
    });
  }, [series, yAxis]);

  return { xScale, yScale };
}

function useChartDomain(series: LineChartSeries[]) {
  return useMemo(() => {
    if (series.length === 0) return { x: undefined, y: undefined };

    const allY = series.flatMap(s => s.data.map(d => d.y));
    const allX = series.flatMap(s => s.data.map(d => d.x?.getTime() ?? 0));

    const calculatePadding = (min: number, max: number, padding: number) => {
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
    };

    const [minY, maxY] = calculatePadding(
      Math.min(...allY),
      Math.max(...allY),
      CHART_CONFIG.padding.y,
    );

    const [minX, maxX] = calculatePadding(
      Math.min(...allX),
      Math.max(...allX),
      CHART_CONFIG.padding.x,
    );

    return {
      x: { min: new Date(minX), max: new Date(maxX) },
      y: { min: minY, max: maxY },
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
  tooltipData: Record<string, LineChartDatum>;
  series: LineChartSeries[];
  palette: string[];
  tooltipFormat?: LineChartProps['tooltipFormat'];
}) {
  const firstDatum = Object.values(tooltipData)[0];

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
      {series.map((s, i) => (
        <Box
          key={s.name}
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
                bgcolor: s.color || palette[i % palette.length],
              }}
            />
            <Typography variant="body2">{s.name}</Typography>
          </Box>
          <Typography variant="body2">
            {tooltipFormat?.y && tooltipData[s.name]
              ? tooltipFormat.y(tooltipData[s.name].y)
              : String(tooltipData[s.name]?.y || '')}
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
}: {
  series: LineChartSeries[];
  xScale: any;
  yScale: any;
  palette: string[];
  width: number;
}) {
  return (
    <>
      {series.map((s, i) => {
        const color = s.color || palette[i % palette.length];

        switch (s.type) {
          case 'line':
            return (
              <>
                <LinePath
                  key={s.name}
                  data={s.data}
                  x={(d: LineChartDatum) => xScale(d.x)}
                  y={(d: LineChartDatum) => yScale(d.y)}
                  stroke={color}
                  strokeWidth={4}
                />
                {s.data.map(d => (
                  <GlyphCircle
                    key={`${s.name}-${d.x?.getTime() ?? 0}`}
                    left={xScale(d.x)}
                    top={yScale(d.y)}
                    size={40}
                    fill={color}
                  />
                ))}
              </>
            );
          case 'bar':
            return (
              <Group key={s.name}>
                {s.data.map(d => {
                  const barWidth = Math.max((width / s.data.length) * 0.6, 1);
                  return (
                    <Bar
                      key={`${s.name}-${d.x?.getTime() ?? 0}`}
                      x={xScale(d.x) - barWidth / 2}
                      y={yScale(d.y)}
                      height={yScale.range()[0] - yScale(d.y)}
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
    </>
  );
}

function LineChart({ series, axisFormat, tooltipFormat, xAxis, yAxis }: LineChartProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const theme = useTheme();
  const palette = useChartPalette();
  const domain = useChartDomain(series);
  const { xScale, yScale } = useChartScales(series, xAxis || domain.x, yAxis || domain.y);

  const margin = useAutoMargin(xScale.ticks(), yScale.ticks(), axisFormat);

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<Record<string, LineChartDatum>>();

  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const bisectDate = useMemo(() => bisector<LineChartDatum, Date>(d => d.x).left, []);

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>, width: number) => {
      const point = localPoint(event);
      if (!point) return;

      const xMax = width - margin.left - margin.right;
      xScale.range([0, xMax]);

      const groupRelativeX = point.x - margin.left;
      const groupRelativeY = point.y - margin.top;
      setCursor({ x: groupRelativeX, y: groupRelativeY });

      const x0 = xScale.invert(groupRelativeX);
      const tooltipData: Record<string, LineChartDatum> = {};

      for (const s of series) {
        const index = bisectDate(s.data, x0, 1);
        const d0 = s.data[index - 1];
        const d1 = s.data[index];
        let d = d0;
        if (d1) {
          d = x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
        }
        tooltipData[s.name] = d;
      }

      const firstDatum = Object.values(tooltipData)[0];
      if (firstDatum) {
        showTooltip({
          tooltipData,
          tooltipLeft: point.x,
          tooltipTop: point.y,
        });
      }
    },
    [showTooltip, series, xScale, bisectDate, margin],
  );

  return (
    <ParentSize>
      {({ width, height }: { width: number; height: number }) => {
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        xScale.range([0, xMax]);
        yScale.range([yMax, 0]);

        if (series.some((s: LineChartSeries) => s.type === 'bar')) {
          yScale.domain([0, ...yScale.domain().slice(1)]);
        }

        return (
          <Box>
            <svg width={width} height={height} ref={tooltipContainerRef}>
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
                />

                {tooltipOpen && cursor && (
                  <Group>
                    <Line
                      from={{ x: cursor.x, y: 0 }}
                      to={{ x: cursor.x, y: yMax }}
                      stroke={theme.palette.divider}
                      strokeWidth={1}
                      pointerEvents="none"
                      strokeDasharray="4,4"
                      shapeRendering="geometricPrecision"
                    />
                    <Line
                      from={{ x: 0, y: cursor.y }}
                      to={{ x: xMax, y: cursor.y }}
                      stroke={theme.palette.divider}
                      strokeWidth={1}
                      pointerEvents="none"
                      strokeDasharray="4,4"
                      shapeRendering="geometricPrecision"
                    />
                    {series.map((s: LineChartSeries, i: number) => {
                      const datum = tooltipData?.[s.name];
                      if (!datum) return null;
                      const color = s.color || palette[i % palette.length];
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
                    })}
                  </Group>
                )}
              </Group>

              <rect
                x={margin.left}
                y={margin.top}
                width={xMax}
                height={yMax}
                fill="transparent"
                onTouchStart={e => handleTooltip(e, width)}
                onTouchMove={e => handleTooltip(e, width)}
                onMouseMove={e => handleTooltip(e, width)}
                onMouseLeave={() => {
                  hideTooltip();
                  setCursor(null);
                }}
              />
            </svg>
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
          </Box>
        );
      }}
    </ParentSize>
  );
}

// ---------------------------------------------------------------------------
// Generic Chart Component

interface ChartConfig<T> {
  title: string;
  queryHook: (vars: { from: string; to: string }) => { data: T | undefined; isLoading: boolean };
  dataSelector: (data: T) => LineChartSeries[] | null | undefined;
  tooltipFormat?: LineChartProps['tooltipFormat'];
  axisFormat?: LineChartProps['axisFormat'];
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

  const series: LineChartSeries[] = useMemo(() => {
    const timeseriesData = data ? dataSelector(data) : null;
    return timeseriesData || [];
  }, [data, dataSelector]);

  const hasData = series.some(s => s.data.length > 0);

  return (
    <Card title={<SquaredChip label={title} color="primary" />}>
      <Box height={CHART_CONFIG.height}>
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
          />
        ) : (
          <Typography variant="body1">No data</Typography>
        )}
      </Box>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Chart Configurations

const CHART_CONFIGS = {
  holders: {
    title: 'Holders',
    queryHook: useHoldersCountTimeseriesQuery,
    dataSelector: (data: HoldersCountTimeseriesQuery) => [
      {
        name: 'Holders',
        data: data.holdersCountTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
          y: fromSqd(d.value).toNumber(),
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
        data: data.activeWorkersTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
        data: data.uniqueOperatorsTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
        data: data.delegationsTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
        data: data.delegatorsTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
          y: d.value.workerApr,
        })),
        type: 'line' as const,
      },
      {
        name: 'Staker APR',
        data: data.aprTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value.stakerApr,
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
    dataSelector: (data: RewardTimeseriesQuery) => [
      {
        name: 'Reward',
        data: data.rewardTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: fromSqd(d.value).toNumber(),
        })),
        type: 'bar' as const,
      },
    ],
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
        data: Object.entries(groupBy(data.transfersByTypeTimeseries, d => d.timestamp)).map(
          ([, transfers]) => ({
            x: new Date(transfers[0].timestamp),
            y: transfers.reduce((acc, d) => acc + d.value, 0),
          }),
        ),
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
  uniqueAccounts: {
    title: 'Active Accounts',
    queryHook: useUniqueAccountsTimeseriesQuery,
    dataSelector: (data: UniqueAccountsTimeseriesQuery) => [
      {
        name: 'Unique Accounts',
        data: data.uniqueAccountsTimeseries.map(d => ({
          x: new Date(d.timestamp),
          y: d.value,
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
          y: d.value,
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
          y: d.value,
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
          y: d.value,
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

// ---------------------------------------------------------------------------
// Individual Chart Components

export function HoldersCount({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.holders} step={step} />;
}

export function LockedValue({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.lockedValue} step={step} />;
}

export function ActiveWorkersChart({
  range,
  step,
}: {
  range: { from: Date; to: Date };
  step?: string;
}) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.activeWorkers} step={step} />;
}

export function UniqueOperatorsCount({
  range,
  step,
}: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueOperators} step={step} />;
}

export function DelegationsCount({
  range,
  step,
}: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.delegations} step={step} />;
}

export function UniqueDelegatorsCount({
  range,
  step,
}: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueDelegators} step={step} />;
}

export function Apr({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.apr} step={step} />;
}

export function Reward({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.reward} step={step} />;
}

export function TransfersCount({
  range,
  step,
}: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.transfers} step={step} />;
}

export function UniqueAccountsCount({
  range,
  step,
}: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.uniqueAccounts} step={step} />;
}

export function QueriesCount({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.queries} step={step} />;
}

export function ServedData({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.servedData} step={step} />;
}

export function StoredData({ range, step }: { range: { from: Date; to: Date }; step?: string }) {
  return <AnalyticsChart range={range} {...CHART_CONFIGS.storedData} step={step} />;
}

// ---------------------------------------------------------------------------
// Main Analytics Component

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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <HoldersCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LockedValue range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActiveWorkersChart range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueOperatorsCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DelegationsCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueDelegatorsCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Apr range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Reward range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TransfersCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UniqueAccountsCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <QueriesCount range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ServedData range={range} step={state.step} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StoredData range={range} step={state.step} />
        </Grid>
      </Grid>
    </CenteredPageWrapper>
  );
}
