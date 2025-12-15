import { useMemo } from 'react';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import type { ScaleTime, ScaleLinear } from 'd3-scale';
import type { SingleChartSeries } from './types';

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

interface DataPoint {
  x: Date;
  y: number;
}

interface LineRendererProps {
  series: SingleChartSeries;
  xScale: XScale;
  yScale: YScale;
  color: string;
  strokeWidth: number;
  fillOpacity: number;
}

export function LineRenderer({
  series,
  xScale,
  yScale,
  color,
  strokeWidth,
  fillOpacity,
}: LineRendererProps) {
  const data = useMemo((): DataPoint[] => {
    const result: DataPoint[] = [];
    for (const d of series.data) {
      if (d.y != null) {
        result.push({ x: d.x, y: d.y });
      }
    }
    return result;
  }, [series.data]);

  const gradientId = useMemo(
    () => `gradient-${series.name.replace(/\s+/g, '-')}`,
    [series.name],
  );

  if (data.length === 0) return null;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <AreaClosed
        data={data}
        x={d => xScale(d.x)}
        y={d => yScale(d.y)}
        yScale={yScale}
        fill={`url(#${gradientId})`}
        curve={curveMonotoneX}
      />
      <LinePath
        data={data}
        x={d => xScale(d.x)}
        y={d => yScale(d.y)}
        stroke={color}
        strokeWidth={strokeWidth}
        curve={curveMonotoneX}
      />
    </g>
  );
}
