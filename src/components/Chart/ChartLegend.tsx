import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import type { ChartSeries } from './types';

interface ChartLegendProps {
  series: ChartSeries[];
  palette: string[];
}

interface LegendItem {
  name: string;
  color: string;
}

export function ChartLegend({ series, palette }: ChartLegendProps) {
  const items = useMemo((): LegendItem[] => {
    return series.map((s, i) => ({
      name: s.name,
      color: s.color ?? palette[i % palette.length],
    }));
  }, [series, palette]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2.5,
        justifyContent: 'center',
        mt: 2.5,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {items.map(item => (
        <Box key={item.name} display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.5,
              bgcolor: item.color,
            }}
          />
          <Typography variant="caption" color="text.secondary" fontSize={11}>
            {item.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
