import { useCallback } from 'react';

import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import type { ScaleTime } from 'd3-scale';

import type { ChartDatum, ChartSeries } from './types';

type XScale = ScaleTime<number, number, never>;

interface CursorPosition {
  x: number;
  y: number;
}

interface TooltipArgs {
  tooltipData: Record<string, ChartDatum<false>>;
  tooltipLeft: number;
  tooltipTop: number;
}

interface UseTooltipHandlerProps {
  series: ChartSeries[];
  xScale: XScale;
  margin: { top: number; right: number; bottom: number; left: number };
  showTooltip: (args: TooltipArgs) => void;
  setCursor: (cursor: CursorPosition | null) => void;
}

const bisectDate = bisector<{ x: Date }, Date>(d => d.x).left;

function findNearestDatum<T extends { x: Date }>(data: T[], targetDate: Date): T {
  const index = bisectDate(data, targetDate, 1);
  const d0 = data[index - 1];
  const d1 = data[index];

  if (!d1) return d0;
  return targetDate.valueOf() - d0.x.valueOf() > d1.x.valueOf() - targetDate.valueOf() ? d1 : d0;
}

function extractTooltipData(
  series: ChartSeries[],
  targetDate: Date,
): Record<string, ChartDatum<false>> {
  const tooltipData: Record<string, ChartDatum<false>> = {};

  for (const s of series) {
    if (s.stack) {
      const datum = findNearestDatum(s.data, targetDate);

      for (const { key, value } of datum.y) {
        if (value != null) {
          tooltipData[key] = { x: datum.x, y: value };
        }
      }
    } else {
      const datum = findNearestDatum(s.data, targetDate);
      if (datum.y != null) {
        tooltipData[s.name ?? ''] = { x: datum.x, y: datum.y };
      }
    }
  }

  return tooltipData;
}

export function useTooltipHandler({
  series,
  xScale,
  margin,
  showTooltip,
  setCursor,
}: UseTooltipHandlerProps) {
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const point = localPoint(event);
      if (!point) return;

      const groupRelativeX = point.x - margin.left;
      const groupRelativeY = point.y - margin.top;

      setCursor({
        x: groupRelativeX,
        y: groupRelativeY,
      });

      const targetDate = xScale.invert(groupRelativeX);
      const tooltipData = extractTooltipData(series, targetDate);

      const firstDatum = Object.values(tooltipData)[0];
      if (firstDatum) {
        showTooltip({
          tooltipData,
          tooltipLeft: groupRelativeX,
          tooltipTop: groupRelativeY,
        });
      }
    },
    [showTooltip, series, xScale, margin, setCursor],
  );

  return handleTooltip;
}
