import { useCallback, useMemo, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useHistoricalTokenPrices } from '@api/price';
import { Card } from '@components/Card';
import { LineChart, SharedCursorProvider } from '@components/Chart';

import { usePoolData } from './hooks';
import { calculateApyOrZero } from './utils/poolUtils';

type TimePeriod = '1w' | '1m' | '3m';

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

export function PoolYieldChart({ poolId }: PoolYieldChartProps) {
  const { data: pool } = usePoolData(poolId);
  const [period, setPeriod] = useState<TimePeriod>('1m');

  const { monthlyPayoutUsd, tvlInSqd } = useMemo(
    () => ({
      monthlyPayoutUsd: pool?.distributionRatePerSecond.times(30 * 86400).toNumber() ?? 0,
      tvlInSqd: pool ? pool.tvl.max.toNumber() : 0,
    }),
    [pool],
  );

  const handlePeriodChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newPeriod: TimePeriod | null) => {
      if (newPeriod) {
        setPeriod(newPeriod);
      }
    },
    [],
  );

  const range = useMemo(
    () => getTimeRangeFromPeriod(pool?.createdAt || new Date(0), period),
    [pool, period],
  );

  const { data: chartPrices, isLoading: isChartLoading } = useHistoricalTokenPrices({
    address: '0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1',
    from: range.from,
    to: range.to,
    points: 50,
  });

  const chartSeries = useMemo(() => {
    if (!chartPrices || chartPrices.length === 0) return [];

    return [
      {
        name: 'APY',
        type: 'line' as const,
        color: '#4A90E2',
        data: chartPrices.map(({ timestamp, price }) => ({
          x: new Date(timestamp * 1000),
          y: calculateApyOrZero(monthlyPayoutUsd, tvlInSqd, price) * 100,
        })),
      },
    ];
  }, [chartPrices, monthlyPayoutUsd, tvlInSqd]);

  return (
    <Card
      title={
        <ToggleButtonGroup value="apy" exclusive>
          <ToggleButton value="apy">APY</ToggleButton>
          <ToggleButton value="tvl" disabled>
            TVL
          </ToggleButton>
        </ToggleButtonGroup>
      }
      subtitle="Historical APY based on past SQD token prices."
      action={
        <ToggleButtonGroup value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="1w">1W</ToggleButton>
          <ToggleButton value="1m">1M</ToggleButton>
          <ToggleButton value="3m">3M</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Box height={218} display="flex" alignItems="center" justifyContent="center">
        {isChartLoading ? (
          <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1, width: '100%' }} />
        ) : (
          <SharedCursorProvider>
            <LineChart
              series={chartSeries}
              xAxis={{ min: range.from, max: range.to }}
              yAxis={{ min: 0 }}
              tooltipFormat={{ y: apyTooltipFormatter }}
              axisFormat={{ y: apyAxisFormatter }}
              strokeWidth={2}
              fillOpacity={0.25}
              margin={{ right: 0 }}
            />
          </SharedCursorProvider>
        )}
      </Box>
    </Card>
  );
}
