import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'viem';

function getChain() {
  return process.env.NETWORK === 'tethys' ? 'arbitrum-sepolia' : 'arbitrum';
}

function getCoin(address: string) {
  return `${getChain()}:${getAddress(address)}`;
}

export function useTokenPrice({ address }: { address: string }) {
  const coin = getCoin(address);
  const { data, isPending, isLoading } = useQuery({
    queryKey: ['tokenPrice', address],
    queryFn: () =>
      fetch(`https://coins.llama.fi/prices/current/${coin}`).then(
        res => res.json() as Promise<{ coins: Record<string, { price: number }> }>,
      ),
    enabled: !!address,
    select: data => data.coins[coin]?.price,
  });

  return {
    data,
    isPending,
    isLoading,
  };
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

interface ChartPriceResponse {
  coins: Record<
    string,
    {
      symbol: string;
      confidence: number;
      decimals: number;
      prices: Array<{ timestamp: number; price: number }>;
    }
  >;
}

export function useHistoricalTokenPrices({
  address,
  from,
  to,
}: {
  address: string;
  from: Date;
  to: Date;
  points?: number; // kept for backward compatibility but not used
}) {
  const coin = getCoin(address);
  const fromTimestamp = Math.floor(from.getTime() / 1000);
  const toTimestamp = Math.floor(to.getTime() / 1000);

  const { data, isPending, isLoading } = useQuery({
    queryKey: ['historicalTokenPrices', address, fromTimestamp, toTimestamp],
    queryFn: async () => {
      // Use the chart endpoint which supports CORS and returns all historical prices
      // API only accepts start OR end, not both. Use start with span to get data points from that time.
      // period determines how far apart each point is (in seconds)
      const periodSeconds = Math.floor((toTimestamp - fromTimestamp) / 50);
      const url = `https://coins.llama.fi/chart/${coin}?start=${fromTimestamp}&span=50&period=${periodSeconds}`;
      const res = await fetch(url);
      const json = (await res.json()) as ChartPriceResponse;
      const coinData = json.coins[coin];

      if (!coinData?.prices) {
        return [];
      }

      // Filter to only include prices within our desired range
      return coinData.prices
        .filter(p => p.timestamp >= fromTimestamp && p.timestamp <= toTimestamp)
        .sort((a, b) => a.timestamp - b.timestamp);
    },
    enabled: !!address,
    staleTime: 10 * 60 * 1000, // 10 minutes - historical data doesn't change
  });

  return {
    data: data as HistoricalPrice[] | undefined,
    isPending,
    isLoading,
  };
}
