import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'viem';

export function useTokenPrice({ address }: { address: string }) {
  const chain = process.env.NETWORK === 'tethys' ? 'arbitrum-sepolia' : 'arbitrum';
  const coin = `${chain}:${getAddress(address)}`;
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
