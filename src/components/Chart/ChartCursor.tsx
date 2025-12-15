import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { Line } from '@visx/shape';
import { Group } from '@visx/group';
import { GlyphCircle } from '@visx/glyph';
import { bisector } from 'd3-array';
import type { ScaleTime, ScaleLinear } from 'd3-scale';
import type { ChartSeries, ChartDatum, StackedChartSeries } from './types';

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorLinesProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CursorLines({ x, y, width, height }: CursorLinesProps) {
  const theme = useTheme();
  const strokeColor = theme.palette.secondary.main;

  return (
    <Group>
      <Line
        from={{ x, y: 0 }}
        to={{ x, y: height }}
        stroke={strokeColor}
        strokeWidth={1}
        pointerEvents="none"
        strokeDasharray="4,4"
        opacity={0.6}
      />
      <Line
        from={{ x: 0, y }}
        to={{ x: width, y }}
        stroke={strokeColor}
        strokeWidth={1}
        pointerEvents="none"
        strokeDasharray="4,4"
        opacity={0.6}
      />
    </Group>
  );
}

interface CursorPointsProps {
  series: ChartSeries[];
  tooltipData: Record<string, ChartDatum<false>> | undefined;
  xScale: XScale;
  yScale: YScale;
  palette: string[];
  cursor: CursorPosition | null;
}

const bisectDate = bisector<{ x: Date }, Date>(d => d.x).left;

function findNearestDatum<T extends { x: Date }>(data: T[], cursorX: number, xScale: XScale): T {
  const x0 = xScale.invert(cursorX);
  const index = bisectDate(data, x0, 1);
  const d0 = data[index - 1];
  const d1 = data[index];

  if (!d1) return d0;
  return x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf() ? d1 : d0;
}

function renderStackedPoints(
  series: StackedChartSeries,
  cursor: CursorPosition,
  xScale: XScale,
  yScale: YScale,
  tooltipData: Record<string, ChartDatum<false>>,
  palette: string[],
) {
  const nearestDatum = findNearestDatum(series.data, cursor.x, xScale);
  const points: React.ReactNode[] = [];

  // Calculate cumulative Y position from top of stack
  let cumulativeY = nearestDatum.y.reduce((acc, { value }) => acc + (value ?? 0), 0);

  for (let i = 0; i < nearestDatum.y.length; i++) {
    const { key, value, color: itemColor } = nearestDatum.y[i];
    if (value == null || !tooltipData[key]) continue;

    // Position point at center of segment
    const segmentCenterY = cumulativeY - value / 2;
    cumulativeY -= value;

    const color = itemColor ?? palette[i % palette.length];

    points.push(
      <GlyphCircle
        key={`${key}-cursor-point`}
        left={xScale(nearestDatum.x)}
        top={yScale(segmentCenterY)}
        size={64}
        fill={color}
        pointerEvents="none"
      />,
    );
  }

  return points;
}

export function CursorPoints({
  series,
  tooltipData,
  xScale,
  yScale,
  palette,
  cursor,
}: CursorPointsProps) {
  const points = useMemo(() => {
    if (!tooltipData || !cursor) return null;

    return series.map((s, i) => {
      // Skip bar charts - they don't need cursor points
      if (s.type === 'bar') return null;

      if (s.stack) {
        return renderStackedPoints(s, cursor, xScale, yScale, tooltipData, palette);
      }

      // Single series point
      const datum = tooltipData[s.name];
      if (!datum) return null;

      const color = s.color ?? palette[i % palette.length];

      return (
        <GlyphCircle
          key={`${s.name}-cursor-point`}
          left={xScale(datum.x)}
          top={yScale(datum.y)}
          size={64}
          fill={color}
          pointerEvents="none"
        />
      );
    });
  }, [series, tooltipData, xScale, yScale, palette, cursor]);

  return <Group>{points}</Group>;
}
