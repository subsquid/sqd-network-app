import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import type { ScaleTime, ScaleLinear } from 'd3-scale';
import type { StackedLineChartSeries, SingleLineChartSeries } from './types';

// ============================================================================
// Types
// ============================================================================

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

// ============================================================================
// Bar Chart Rendering Components
// ============================================================================

interface BarRendererProps {
  series: SingleLineChartSeries;
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
  const data = series.data.filter(d => d.y != null);

  return (
    <Group>
      {data.map(d => {
        if (d.y == null) return null;
        const barHeight = Math.max(0, yScale.range()[0] - yScale(d.y));
        const barY = yScale(Math.max(0, d.y));
        const barX = Math.max(0, xScale(d.x) - barWidth / 2);

        return (
          <Bar
            key={`${series.name}-${d.x.getTime()}`}
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
}

interface StackedBarRendererProps {
  series: StackedLineChartSeries;
  xScale: XScale;
  yScale: YScale;
  palette: string[];
  barWidth: number;
  barBorderRadius: number;
}

export function StackedBarRenderer({
  series,
  xScale,
  yScale,
  palette,
  barWidth,
  barBorderRadius,
}: StackedBarRendererProps) {
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

  return <>{barSegments}</>;
}

interface GroupedBarRendererProps {
  barSeries: SingleLineChartSeries[];
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
  if (barSeries.length === 0) return null;

  const groupWidth = barWidth * 0.9;
  const individualBarWidth = groupWidth / barSeries.length;

  return (
    <>
      {barSeries.map((s, seriesIndex) => {
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
                  key={`${s.name}-${d.x.getTime()}`}
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
      })}
    </>
  );
}

export function calculateOptimalBarWidth(
  data: { x: Date }[],
  width: number,
  xScale: XScale,
): number {
  if (data.length < 2) return Math.min(width * 0.1, 40);

  const [minTime, maxTime] = xScale.domain() as [Date, Date];
  const timeRangeMs = maxTime.getTime() - minTime.getTime();

  const sortedData = [...data].sort((a, b) => a.x.getTime() - b.x.getTime());
  const intervals = [];
  for (let i = 1; i < sortedData.length; i++) {
    intervals.push(sortedData[i].x.getTime() - sortedData[i - 1].x.getTime());
  }
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  const expectedDataPoints = Math.max(timeRangeMs / avgInterval, data.length);

  return (width / expectedDataPoints) * 0.5;
}

