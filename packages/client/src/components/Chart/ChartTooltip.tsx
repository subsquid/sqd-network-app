import { useMemo } from 'react';

import { Box, Divider, Paper, Typography } from '@mui/material';

import { toDateSeconds } from '@lib/formatters/formatters';

import type { ChartDatum, ChartFormatters, ChartSeries } from './types';

interface ChartTooltipProps {
  tooltipData: Record<string, ChartDatum<false>>;
  series: ChartSeries[];
  palette: string[];
  tooltipFormat?: ChartFormatters;
  /** When true, show sum row when the tooltip has 2+ series. Default true. */
  tooltipShowTotal?: boolean;
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

export function ChartTooltip({
  tooltipData,
  series,
  palette,
  tooltipFormat,
  tooltipShowTotal = true,
}: ChartTooltipProps) {
  const firstDatum = Object.values(tooltipData)[0];
  const entries = useMemo(
    () =>
      Object.entries(tooltipData).sort(([, a], [, b]) => {
        const ya = typeof a.y === 'number' ? a.y : -Infinity;
        const yb = typeof b.y === 'number' ? b.y : -Infinity;
        return yb - ya;
      }),
    [tooltipData],
  );
  const showTotal = tooltipShowTotal && entries.length >= 2;
  const totalY = showTotal
    ? entries.reduce((sum, [, d]) => sum + (typeof d.y === 'number' ? d.y : 0), 0)
    : 0;

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
      {entries.map(([key, datum]) => (
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
      {showTotal && (
        <>
          <Divider sx={{ my: 0.5 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minWidth: 160,
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, flexShrink: 0 }} />
              <Typography variant="body2">Total</Typography>
            </Box>
            <Typography variant="body2">{formatY ? formatY(totalY) : String(totalY)}</Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
