import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import type { ScaleTime, ScaleLinear } from 'd3-scale';
import type { SingleLineChartDatum, SingleLineChartSeries } from './types';

// ============================================================================
// Types
// ============================================================================

type XScale = ScaleTime<number, number, never>;
type YScale = ScaleLinear<number, number, never>;

// ============================================================================
// Line Chart Rendering Component
// ============================================================================

interface LineRendererProps {
  series: SingleLineChartSeries;
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
  const data = series.data.filter(d => d.y != null);
  const gradientId = `gradient-${series.name.replace(/\s+/g, '-')}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <AreaClosed<SingleLineChartDatum>
        data={data}
        x={d => xScale(d.x)}
        y={d => yScale(d.y ?? 0)}
        yScale={yScale}
        fill={`url(#${gradientId})`}
        curve={curveMonotoneX}
      />
      <LinePath<SingleLineChartDatum>
        data={data}
        x={d => xScale(d.x)}
        y={d => yScale(d.y ?? 0)}
        stroke={color}
        strokeWidth={strokeWidth}
        curve={curveMonotoneX}
      />
    </g>
  );
}
