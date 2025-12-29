import { useMemo } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { toDateSeconds } from '@lib/formatters/formatters';
import type { ChartDatum, ChartFormatters, ChartSeries } from './types';

interface ChartTooltipProps {
  tooltipData: Record<string, ChartDatum<false>>;
  series: ChartSeries[];
  palette: string[];
  tooltipFormat?: ChartFormatters;
}

function buildColorMap(series: ChartSeries[], palette: string[]): Map<string, string> {
  const colorMap = new Map<string, string>();

  series.forEach((s, i) => {
    if (s.stack && s.data.length > 0) {
      // For stacked series, map each stack item key to its color
      s.data[0].y.forEach((item, stackIndex) => {
        colorMap.set(item.key, item.color ?? palette[stackIndex % palette.length]);
      });
    } else {
      colorMap.set(s.name ?? '', s.color ?? palette[i % palette.length]);
    }
  });

  return colorMap;
}

export function ChartTooltip({ tooltipData, series, palette, tooltipFormat }: ChartTooltipProps) {
  const firstDatum = Object.values(tooltipData)[0];

  const colorMap = useMemo(() => buildColorMap(series, palette), [series, palette]);

  const formatX = tooltipFormat?.x ?? toDateSeconds.format;
  const formatY = tooltipFormat?.y;

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      {firstDatum && (
        <>
          <Typography variant="body2">{formatX(firstDatum.x)}</Typography>
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
                bgcolor: colorMap.get(key) ?? palette[0],
              }}
            />
            <Typography variant="body2">{key}</Typography>
          </Box>
          <Typography variant="body2">
            {formatY && datum.y != null ? formatY(datum.y) : String(datum.y ?? '')}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
