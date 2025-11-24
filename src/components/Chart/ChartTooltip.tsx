import { Box, Divider, Paper, Typography } from '@mui/material';
import { toDateSeconds } from '@lib/formatters/formatters';
import type { LineChartProps, LineChartSeries, SingleLineChartDatum } from './types';

// ============================================================================
// Chart Tooltip Component
// ============================================================================

interface ChartTooltipProps {
  tooltipData: Record<string, SingleLineChartDatum<false>>;
  series: LineChartSeries[];
  palette: string[];
  tooltipFormat?: LineChartProps['tooltipFormat'];
}

export function ChartTooltip({
  tooltipData,
  series,
  palette,
  tooltipFormat,
}: ChartTooltipProps) {
  const firstDatum = Object.values(tooltipData)[0];

  // Create a map of series names to colors for quick lookup
  const seriesColorMap = new Map<string, string>();
  series.forEach((s, i) => {
    if (s.stack && s.data.length > 0) {
      // For stacked series, map each stack item key to a color
      s.data[0].y.forEach((item, stackIndex) => {
        seriesColorMap.set(item.key, item.color ?? palette[stackIndex % palette.length]);
      });
    } else {
      seriesColorMap.set(s.name, s.color ?? palette[i % palette.length]);
    }
  });

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      {firstDatum && (
        <>
          <Typography variant="body2">
            {tooltipFormat?.x ? tooltipFormat.x(firstDatum.x) : toDateSeconds.format(firstDatum.x)}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
        </>
      )}
      {Object.entries(tooltipData).map(([key, datum]) => (
        <Box
          key={key}
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
                bgcolor: seriesColorMap.get(key) || palette[0],
              }}
            />
            <Typography variant="body2">{key}</Typography>
          </Box>
          <Typography variant="body2">
            {tooltipFormat?.y && datum.y != null ? tooltipFormat.y(datum.y) : String(datum.y || '')}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

