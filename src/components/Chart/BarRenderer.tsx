import { useMemo } from 'react';

import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import type { ScaleLinear, ScaleTime } from 'd3-scale';

import type { SingleChartSeries, StackedChartSeries } from './types';

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

interface BarDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

function calculateBarDimensions(
  dataX: Date,
  dataY: number,
  xScale: XScale,
  yScale: YScale,
  barWidth: number,
): BarDimensions {
  const yBottom = yScale.range()[0];
  const barY = yScale(Math.max(0, dataY));

  return {
    x: Math.max(0, xScale(dataX) - barWidth / 2),
    y: barY,
    width: barWidth,
    height: Math.max(0, yBottom - barY),
  };
}

export function calculateOptimalBarWidth(
  data: { x: Date }[],
  width: number,
  xScale: XScale,
): number {
  if (data.length < 2) return Math.min(width * 0.1, 40);

  const [minTime, maxTime] = xScale.domain() as [Date, Date];
  const timeRangeMs = maxTime.getTime() - minTime.getTime();

  // Calculate average interval between data points
  const sortedData = [...data].sort((a, b) => a.x.getTime() - b.x.getTime());
  let totalInterval = 0;
  for (let i = 1; i < sortedData.length; i++) {
    totalInterval += sortedData[i].x.getTime() - sortedData[i - 1].x.getTime();
  }
  const avgInterval = totalInterval / (sortedData.length - 1);

  // Estimate expected data points and calculate bar width
  const expectedDataPoints = Math.max(timeRangeMs / avgInterval, data.length);
  return (width / expectedDataPoints) * 0.5;
}

interface BarRendererProps {
  series: SingleChartSeries;
  xScale: XScale;
  yScale: YScale;
  color: string;
  barWidth: number;
  barBorderRadius: number;
}

export function BarRenderer({
  series,
  xScale,
  yScale,
  color,
  barWidth,
  barBorderRadius,
}: BarRendererProps) {
  const bars = useMemo(() => {
    return series.data
      .filter(d => d.y != null)
      .map(d => ({
        key: `${series.name}-${d.x.getTime()}`,
        ...calculateBarDimensions(d.x, d.y!, xScale, yScale, barWidth),
      }));
  }, [series, xScale, yScale, barWidth]);

  return (
    <Group>
      {bars.map(bar => (
        <Bar
          key={bar.key}
          x={bar.x}
          y={bar.y}
          height={bar.height}
          width={bar.width}
          fill={color}
          rx={barBorderRadius}
        />
      ))}
    </Group>
  );
}

interface StackedBarRendererProps {
  series: StackedChartSeries;
  xScale: XScale;
  yScale: YScale;
  palette: string[];
  barWidth: number;
  barBorderRadius: number;
}

interface StackSegment {
  key: string;
  x: number;
  y: number;
  height: number;
  color: string;
}

export function StackedBarRenderer({
  series,
  xScale,
  yScale,
  palette,
  barWidth,
  barBorderRadius,
}: StackedBarRendererProps) {
  const segments = useMemo((): StackSegment[] => {
    const yBottom = yScale.range()[0];
    const result: StackSegment[] = [];

    for (const datum of series.data) {
      const barX = Math.max(0, xScale(datum.x) - barWidth / 2);

      // Calculate total stack height for positioning from top
      let cumulativeY = datum.y.reduce((acc, { value }) => acc + (value ?? 0), 0);

      for (let i = 0; i < datum.y.length; i++) {
        const { key, color, value } = datum.y[i];
        if (value == null) continue;

        const barY = yScale(cumulativeY);
        const barHeight = Math.max(0, yBottom - barY);
        cumulativeY -= value;

        result.push({
          key: `${key}-${datum.x.getTime()}`,
          x: barX,
          y: barY,
          height: barHeight,
          color: color ?? palette[i % palette.length],
        });
      }
    }

    return result;
  }, [series, xScale, yScale, palette, barWidth]);

  return (
    <Group>
      {segments.map(segment => (
        <Bar
          key={segment.key}
          x={segment.x}
          y={segment.y}
          height={segment.height}
          width={barWidth}
          fill={segment.color}
          rx={barBorderRadius}
        />
      ))}
    </Group>
  );
}

interface GroupedBarRendererProps {
  barSeries: SingleChartSeries[];
  xScale: XScale;
  yScale: YScale;
  palette: string[];
  barWidth: number;
  barBorderRadius: number;
}

export function GroupedBarRenderer({
  barSeries,
  xScale,
  yScale,
  palette,
  barWidth,
  barBorderRadius,
}: GroupedBarRendererProps) {
  const groupedBars = useMemo(() => {
    if (barSeries.length === 0) return [];

    const groupWidth = barWidth * 0.9;
    const individualBarWidth = groupWidth / barSeries.length;
    const yBottom = yScale.range()[0];

    return barSeries.flatMap((series, seriesIndex) => {
      const color = series.color ?? palette[seriesIndex % palette.length];

      return series.data
        .filter(d => d.y != null)
        .map(d => {
          const barY = yScale(Math.max(0, d.y!));
          const groupX = xScale(d.x) - groupWidth / 2;

          return {
            key: `${series.name}-${d.x.getTime()}`,
            x: Math.max(0, groupX + seriesIndex * individualBarWidth),
            y: barY,
            height: Math.max(0, yBottom - barY),
            width: individualBarWidth,
            color,
          };
        });
    });
  }, [barSeries, xScale, yScale, palette, barWidth]);

  if (groupedBars.length === 0) return null;

  return (
    <Group>
      {groupedBars.map(bar => (
        <Bar
          key={bar.key}
          x={bar.x}
          y={bar.y}
          height={bar.height}
          width={bar.width}
          fill={bar.color}
          rx={barBorderRadius}
        />
      ))}
    </Group>
  );
}
