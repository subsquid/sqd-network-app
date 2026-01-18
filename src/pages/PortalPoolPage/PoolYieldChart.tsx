import { useCallback, useMemo, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import BigNumber from 'bignumber.js';

import { useHistoricalTokenPrices } from '@api/price';
import { useApyTimeseriesQuery, useTvlTimeseriesQuery } from '@api/pool-squid/graphql';
import { Card } from '@components/Card';
import { LineChart, SharedCursorProvider } from '@components/Chart';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { usePoolData } from './hooks';
import type { PoolData } from './hooks/types';
import { CHART_TEXTS } from './texts';

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
  pool: PoolData;
  range: { from: Date; to: Date };
}

function ApyLineChart({ poolId, pool, range }: ApyLineChartProps) {
  const { data: rewardRateData } = useApyTimeseriesQuery({
    poolId: poolId.toLowerCase(),
    from: range.from.toISOString(),
    to: range.to.toISOString(),
  });

  const priceRange = useMemo(() => {
    if (rewardRateData?.apyTimeseries) {
      return {
        from: new Date(rewardRateData.apyTimeseries.from),
        to: new Date(rewardRateData.apyTimeseries.to),
        period: rewardRateData.apyTimeseries.step,
      };
    }
    return { from: range.from, to: range.to, period: undefined };
  }, [rewardRateData, range]);

  const { data: chartPrices } = useHistoricalTokenPrices({
    address: '0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1',
    from: priceRange.from,
    to: priceRange.to,
  });

  const series = useMemo(() => {
    if (
      !chartPrices ||
      chartPrices.length === 0 ||
      !rewardRateData?.apyTimeseries.data ||
      !pool?.rewardToken
    ) {
      return [];
    }

    // Create a map of prices by timestamp for quick lookup
    const priceMap = new Map(chartPrices.map(({ timestamp, price }) => [timestamp * 1000, price]));

    // Helper function to find the closest price for a given timestamp
    const findClosestPrice = (targetTimestamp: number): number | null => {
      let closestTimestamp: number | null = null;
      let minDiff = Infinity;

      for (const timestamp of priceMap.keys()) {
        const diff = Math.abs(timestamp - targetTimestamp);
        if (diff < minDiff) {
          minDiff = diff;
          closestTimestamp = timestamp;
        }
      }

      return closestTimestamp !== null ? (priceMap.get(closestTimestamp) ?? null) : null;
    };

    const data = rewardRateData.apyTimeseries.data
      .map((entry, index) => {
        const timestampMs = new Date(entry.timestamp).getTime();

        // Find closest price
        const price = findClosestPrice(timestampMs);

        if (!price || price <= 0) {
          return null;
        }

        // Convert reward rate from raw BigInt to USD per second
        const apy = BigNumber(entry.value)
          .times(10 ** (18 - pool.rewardToken.decimals))
          .div(price)
          .toNumber();

        return {
          x: new Date(timestampMs),
          y: apy * 100,
        };
      })
      .filter((point): point is { x: Date; y: number } => point !== null);

    return [
      {
        name: CHART_TEXTS.labels.apy,
        type: 'line' as const,
        color: '#4A90E2',
        data,
      },
    ];
  }, [chartPrices, rewardRateData, pool]);

  const xAxisRange = useMemo(() => {
    if (rewardRateData?.apyTimeseries) {
      return {
        min: new Date(rewardRateData.apyTimeseries.from),
        max: new Date(rewardRateData.apyTimeseries.to),
      };
    }
    return { min: range.from, max: range.to };
  }, [rewardRateData, range]);

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
  const { data: tvlData } = useTvlTimeseriesQuery({
    poolId: poolId.toLowerCase(),
    from: range.from.toISOString(),
    to: range.to.toISOString(),
  });

  const series = useMemo(() => {
    if (!tvlData?.tvlTimeseries.data) {
      return [];
    }

    const stableData = tvlData.tvlTimeseries.data.map(entry => ({
      x: new Date(entry.timestamp),
      y: fromSqd(BigInt(entry.value.tvlStable)).toNumber(),
    }));

    const totalData = tvlData.tvlTimeseries.data.map(entry => ({
      x: new Date(entry.timestamp),
      y: fromSqd(BigInt(entry.value.tvlTotal)).toNumber(),
    }));

    return [
      {
        name: 'Stable TVL',
        type: 'line' as const,
        color: '#4A90E2',
        data: stableData,
      },
      {
        name: 'Total TVL',
        type: 'line' as const,
        color: '#82B1FF',
        data: totalData,
      },
    ];
  }, [tvlData]);

  const xAxisRange = useMemo(() => {
    if (tvlData?.tvlTimeseries) {
      return {
        min: new Date(tvlData.tvlTimeseries.from),
        max: new Date(tvlData.tvlTimeseries.to),
      };
    }
    return { min: range.from, max: range.to };
  }, [tvlData, range]);

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
  const { data: pool } = usePoolData(poolId);
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

  const range = useMemo(
    () => getTimeRangeFromPeriod(pool?.createdAt || new Date(0), period),
    [pool, period],
  );

  return (
    <Card
      title={
        <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange}>
          <ToggleButton value="apy">{CHART_TEXTS.labels.apy}</ToggleButton>
          <ToggleButton value="tvl">{CHART_TEXTS.labels.tvl}</ToggleButton>
        </ToggleButtonGroup>
      }
      subtitle={CHART_TEXTS.subtitle[chartType](SQD_TOKEN)}
      action={
        <ToggleButtonGroup value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="1w">{CHART_TEXTS.periods.oneWeek}</ToggleButton>
          <ToggleButton value="1m">{CHART_TEXTS.periods.oneMonth}</ToggleButton>
          <ToggleButton value="3m">{CHART_TEXTS.periods.threeMonths}</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Box height={218} display="flex" alignItems="center" justifyContent="center">
        {!pool ? (
          <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1, width: '100%' }} />
        ) : chartType === 'apy' ? (
          <ApyLineChart poolId={poolId} pool={pool} range={range} />
        ) : (
          <TvlLineChart poolId={poolId} range={range} />
        )}
      </Box>
    </Card>
  );
}
