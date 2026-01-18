import { useQuery } from '@tanstack/react-query';

function getChain() {
  return process.env.NETWORK === 'tethys' ? 'arbitrum-sepolia' : 'arbitrum';
}

function getCoin(address: string) {
  return `${'arbitrum'}:${'0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1'}`;
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
      const url = `https://coins.llama.fi/chart/${coin}?start=${fromTimestamp}&span=${100}&period=1h`;
      const res = await fetch(url);
      const json = (await res.json()) as ChartPriceResponse;
      const coinData = json.coins[coin];

      if (!coinData?.prices) {
        return [];
      }

      return coinData.prices;
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
