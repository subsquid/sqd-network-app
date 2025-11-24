import React from 'react';
import { useTheme } from '@mui/material';
import { Line } from '@visx/shape';
import { Group } from '@visx/group';
import { GlyphCircle } from '@visx/glyph';
import { bisector } from 'd3-array';
import type { ScaleTime, ScaleLinear } from 'd3-scale';
import type { LineChartSeries, SingleLineChartDatum } from './types';

// ============================================================================
// Types
// ============================================================================

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

// ============================================================================
// Chart Cursor Components
// ============================================================================

interface CursorLinesProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CursorLines({ x, y, width, height }: CursorLinesProps) {
  const theme = useTheme();

  return (
    <Group>
      <Line
        from={{ x, y: 0 }}
        to={{ x, y: height }}
        stroke={theme.palette.secondary.main}
        strokeWidth={1}
        pointerEvents="none"
        strokeDasharray="4,4"
        opacity={0.6}
      />
      <Line
        from={{ x: 0, y }}
        to={{ x: width, y }}
        stroke={theme.palette.secondary.main}
        strokeWidth={1}
        pointerEvents="none"
        strokeDasharray="4,4"
        opacity={0.6}
      />
    </Group>
  );
}

interface CursorPointsProps {
  series: LineChartSeries[];
  tooltipData: Record<string, SingleLineChartDatum<false>> | undefined;
  xScale: XScale;
  yScale: YScale;
  palette: string[];
  cursor: { x: number; y: number } | null;
}

export function CursorPoints({
  series,
  tooltipData,
  xScale,
  yScale,
  palette,
  cursor,
}: CursorPointsProps) {
  const bisectDate = React.useMemo(() => bisector<{ x: Date }, Date>(d => d.x).left, []);

  return (
    <Group>
      {series.map((s, i) => {
        if (s.type === 'bar') return null;

        if (s.stack) {
          if (!cursor) return null;
          const x0 = xScale.invert(cursor.x);
          const index = bisectDate(s.data, x0, 1);
          const d0 = s.data[index - 1];
          const d1 = s.data[index];
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
  );
}

