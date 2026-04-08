import { useCallback, useMemo, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { Card } from '@components/Card';
import { LineChart, SharedCursorProvider } from '@components/Chart';
import { useContracts } from '@hooks/network/useContracts';
import { tokenFormatter } from '@lib/formatters/formatters';

type TimePeriod = '1w' | '1m' | '3m';
type ChartType = 'apy' | 'tvl';

interface PoolYieldChartProps {
  poolId: string;
}

const TIME_PERIODS: Record<TimePeriod, number> = {
  '1w': 7 * 24 * 60 * 60 * 1000,
  '1m': 30 * 24 * 60 * 60 * 1000,
  '3m': 90 * 24 * 60 * 60 * 1000,
};

function getTimeRangeFromPeriod(min: Date, period: TimePeriod): { from: Date; to: Date } {
  const now = new Date();
  const from = Math.max(min.getTime(), now.getTime() - TIME_PERIODS[period]);
  return { from: new Date(from), to: now };
}

const apyAxisFormatter = (d: number) => `${d.toFixed(1)}%`;
const apyTooltipFormatter = (d: number) => `${d.toFixed(2)}%`;
const tvlTooltipFormatter = (d: number) => tokenFormatter(d, 'SQD');

interface ApyLineChartProps {
  poolId: string;
  range: { from: Date; to: Date };
}

function ApyLineChart({ poolId, range }: ApyLineChartProps) {
  const { data: chartData, isLoading } = useQuery(
    trpc.pool.apyTimeseries.queryOptions({
      poolId: poolId.toLowerCase(),
      from: range.from,
      to: range.to,
    }),
  );

  const series = useMemo(() => {
    if (!chartData?.data?.length) {
      return [];
    }

    return [
      {
        name: 'APY',
        type: 'line' as const,
        color: '#4A90E2',
        data: chartData.data.map(entry => ({
          x: new Date(entry.timestamp),
          y: entry.value,
        })),
      },
    ];
  }, [chartData]);

  const xAxisRange = useMemo(() => {
    if (chartData) {
      return {
        min: new Date(chartData.from),
        max: new Date(chartData.to),
      };
    }
    return { min: range.from, max: range.to };
  }, [chartData, range]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1, width: '100%' }} />;
  }

  return (
    <SharedCursorProvider>
      <LineChart
        series={series}
        xAxis={{ min: xAxisRange.min, max: xAxisRange.max }}
        yAxis={{ min: 0 }}
        tooltipFormat={{ y: apyTooltipFormatter }}
        axisFormat={{ y: apyAxisFormatter }}
        strokeWidth={2}
        fillOpacity={0.25}
        margin={{ right: 0 }}
      />
    </SharedCursorProvider>
  );
}

interface TvlLineChartProps {
  poolId: string;
  range: { from: Date; to: Date };
}

function TvlLineChart({ poolId, range }: TvlLineChartProps) {
  const { data: tvlData, isLoading: isTvlLoading } = useQuery(
    trpc.pool.tvlTimeseries.queryOptions({
      poolId: poolId.toLowerCase(),
      from: range.from,
      to: range.to,
    }),
  );

  const series = useMemo(() => {
    if (!tvlData?.data?.length) {
      return [];
    }

    return [
      {
        name: 'Stable TVL',
        type: 'line' as const,
        color: '#4A90E2',
        data: tvlData.data.map(entry => ({
          x: new Date(entry.timestamp),
          y: entry.tvlStable,
        })),
      },
      {
        name: 'Total TVL',
        type: 'line' as const,
        color: '#82B1FF',
        data: tvlData.data.map(entry => ({
          x: new Date(entry.timestamp),
          y: entry.tvlTotal,
        })),
      },
    ];
  }, [tvlData]);

  const xAxisRange = useMemo(() => {
    if (tvlData) {
      return {
        min: new Date(tvlData.from),
        max: new Date(tvlData.to),
      };
    }
    return { min: range.from, max: range.to };
  }, [tvlData, range]);

  if (isTvlLoading) {
    return <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1, width: '100%' }} />;
  }

  return (
    <SharedCursorProvider>
      <LineChart
        series={series}
        xAxis={{ min: xAxisRange.min, max: xAxisRange.max }}
        yAxis={{ min: 0 }}
        tooltipFormat={{ y: tvlTooltipFormatter }}
        strokeWidth={2}
        fillOpacity={0.25}
        margin={{ right: 0 }}
      />
    </SharedCursorProvider>
  );
}

export function PoolYieldChart({ poolId }: PoolYieldChartProps) {
  const { SQD_TOKEN } = useContracts();
  const [period, setPeriod] = useState<TimePeriod>('1m');
  const [chartType, setChartType] = useState<ChartType>('apy');

  const handlePeriodChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newPeriod: TimePeriod | null) => {
      if (newPeriod) {
        setPeriod(newPeriod);
      }
    },
    [],
  );

  const handleChartTypeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newChartType: ChartType | null) => {
      if (newChartType) {
        setChartType(newChartType);
      }
    },
    [],
  );

  const range = useMemo(() => getTimeRangeFromPeriod(new Date(0), period), [period]);

  return (
    <Card
      title={
        <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange}>
          <ToggleButton value="apy">APY</ToggleButton>
          <ToggleButton value="tvl">TVL</ToggleButton>
        </ToggleButtonGroup>
      }
      subtitle={
        chartType === 'apy'
          ? `Historical APY based on past ${SQD_TOKEN} token prices.`
          : `Historical TVL showing provided ${SQD_TOKEN} tokens over time.`
      }
      action={
        <ToggleButtonGroup value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="1w">1W</ToggleButton>
          <ToggleButton value="1m">1M</ToggleButton>
          <ToggleButton value="3m">3M</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Box height={218} display="flex" alignItems="center" justifyContent="center">
        {chartType === 'apy' ? (
          <ApyLineChart poolId={poolId} range={range} />
        ) : (
          <TvlLineChart poolId={poolId} range={range} />
        )}
      </Box>
    </Card>
  );
}
