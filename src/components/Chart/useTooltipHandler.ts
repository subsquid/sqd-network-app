import { useCallback, useMemo } from "react";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import type { ScaleTime } from "d3-scale";
import type { LineChartSeries, SingleLineChartDatum } from "./types";

// ============================================================================
// Types
// ============================================================================

type XScale = ScaleTime<number, number, never>;

// ============================================================================
// Tooltip Handler Hook
// ============================================================================

interface UseTooltipHandlerProps {
  series: LineChartSeries[];
  xScale: XScale;
  margin: { top: number; right: number; bottom: number; left: number };
  showTooltip: (args: {
    tooltipData: Record<string, SingleLineChartDatum<false>>;
    tooltipLeft: number;
    tooltipTop: number;
  }) => void;
  setCursor: (cursor: { x: number; y: number } | null) => void;
}

export function useTooltipHandler({
  series,
  xScale,
  margin,
  showTooltip,
  setCursor,
}: UseTooltipHandlerProps) {
  const bisectDate = useMemo(
    () => bisector<{ x: Date }, Date>((d) => d.x).left,
    [],
  );

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
    ) => {
      const point = localPoint(event);
      if (!point) return;

      const groupRelativeX = point.x - margin.left;
      const groupRelativeY = point.y - margin.top;

      setCursor({
        x: groupRelativeX,
        y: groupRelativeY,
      });

      const x0 = xScale.invert(groupRelativeX);
      const tooltipData: Record<string, SingleLineChartDatum<false>> = {};

      for (const s of series) {
        if (s.stack) {
          const index = bisectDate(s.data, x0, 1);
          const d0 = s.data[index - 1];
          const d1 = s.data[index];
          let d = d0;
          if (d1) {
            d =
              x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf()
                ? d1
                : d0;
          }

          for (const y of d.y) {
            if (y.value != null) {
              tooltipData[y.key] = { x: d.x, y: y.value };
            }
          }
        } else {
          const index = bisectDate(s.data, x0, 1);
          const d0 = s.data[index - 1];
          const d1 = s.data[index];
          let d = d0;
          if (d1) {
            d =
              x0.valueOf() - d0.x.valueOf() > d1.x.valueOf() - x0.valueOf()
                ? d1
                : d0;
          }
          if (d.y == null) continue;
          tooltipData[s.name] = { x: d.x, y: d.y };
        }
      }

      const firstDatum = Object.values(tooltipData)[0];
      if (firstDatum) {
        showTooltip({
          tooltipData,
          tooltipLeft: point.x - margin.left,
          tooltipTop: point.y - margin.top,
        });
      }
    },
    [showTooltip, series, xScale, bisectDate, margin, setCursor],
  );

  return handleTooltip;
}
