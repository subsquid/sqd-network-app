import { useState, useMemo } from 'react';
import {
  Box,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';

import { useHistoricalTokenPrices } from '@api/price';
import { LineChart, SharedCursorProvider } from '@components/Chart';
import { useContracts } from '@network/useContracts';
import { Card } from '@components/Card';

type TimePeriod = '1w' | '1m' | '3m' | '1y';

interface PoolYieldChartProps {
  monthlyPayoutUsd: number;
  tvlInSqd: number;
}

// Calculate APY at a given price point
// APY = (monthlyPayoutUsd * 12) / (tvlInSqd * sqdPrice)
function calculateApyAtPrice(monthlyPayoutUsd: number, tvlInSqd: number, sqdPrice: number): number {
  if (sqdPrice <= 0 || tvlInSqd <= 0) return 0;
  const tvlUsd = tvlInSqd * sqdPrice;
  const annualPayoutUsd = monthlyPayoutUsd * 12;
  return annualPayoutUsd / tvlUsd;
}

function getTimeRangeFromPeriod(period: TimePeriod): { from: Date; to: Date } {
  const now = new Date();

  let from: Date;
  switch (period) {
    case '1w':
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3m':
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { from, to: now };
}

// Custom percent formatter with more decimals for small APY values
const apyAxisFormatter = (d: number) => `${d.toFixed(1)}%`;
const apyTooltipFormatter = (d: number) => `${d.toFixed(2)}%`;

export function PoolYieldChart({ monthlyPayoutUsd, tvlInSqd }: PoolYieldChartProps) {
  const [period, setPeriod] = useState<TimePeriod>('1m');
  const { SQD } = useContracts();

  const handlePeriodChange = (_: React.MouseEvent<HTMLElement>, newPeriod: TimePeriod | null) => {
    if (newPeriod) {
      setPeriod(newPeriod);
    }
  };

  const range = useMemo(() => getTimeRangeFromPeriod(period), [period]);

  // Fetch chart data for the selected period with appropriate granularity
  const { data: chartPrices, isLoading: isChartLoading } = useHistoricalTokenPrices({
    address: SQD,
    from: range.from,
    to: range.to,
    points: 50,
  });

  // Build chart series directly for LineChart
  const chartSeries = useMemo(() => {
    if (!chartPrices || chartPrices.length === 0) return [];

    return [
      {
        name: 'APY',
        type: 'line' as const,
        color: '#4A90E2',
        data: chartPrices.map(({ timestamp, price }) => ({
          x: new Date(timestamp * 1000),
          // Multiply by 100 to convert ratio to percentage for display
          y: calculateApyAtPrice(monthlyPayoutUsd, tvlInSqd, price) * 100,
        })),
      },
    ];
  }, [chartPrices, monthlyPayoutUsd, tvlInSqd]);

  const priceTooltip =
    'Rolling APY calculated from historical SQD prices.\nAPY = (Monthly Payout × 12) / (TVL × SQD Price)\nPrice data via DefiLlama.';

  return (
    <Card
      title="APY"
      subtitle="Rolling APY calculated from historical SQD prices."
      action={
        <ToggleButtonGroup value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="1w">1W</ToggleButton>
          <ToggleButton value="1m">1M</ToggleButton>
          <ToggleButton value="3m">3M</ToggleButton>
        </ToggleButtonGroup>
      }
      sx={{ height: '100%', width: '100%' }}
    >
      <Box height={200} width={1} display="flex" alignItems="center" justifyContent="center">
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
